package com.adc.order.service;

import com.adc.commonlibrary.exception.NotFoundException;
import com.adc.commonlibrary.utils.AuthenticationUtils;
import com.adc.commonlibrary.model.OutboxService;
import com.adc.commonlibrary.saga.SagaEvent;
import com.adc.commonlibrary.saga.SagaTopics;
import com.adc.commonlibrary.saga.payload.OrderCreatedPayload;
import com.adc.commonlibrary.saga.payload.OrderItemPayload;
import com.adc.order.model.Order;
import com.adc.order.model.OrderAddress;
import com.adc.order.model.OrderItem;
import com.adc.order.model.enumeration.DeliveryStatus;
import com.adc.order.model.enumeration.OrderStatus;
import com.adc.order.model.enumeration.PaymentStatus;
import com.adc.order.repository.OrderItemRepository;
import com.adc.order.repository.OrderRepository;
import com.adc.order.saga.OrderSagaState;
import com.adc.order.saga.OrderSagaStateRepository;
import com.adc.order.viewmodel.PaymentOrderStatusVm;
import com.adc.order.viewmodel.order.OrderItemVm;
import com.adc.order.viewmodel.order.OrderPostVm;
import com.adc.order.viewmodel.order.OrderVm;
import com.adc.order.viewmodel.orderaddress.OrderAddressPostVm;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OutboxService outboxService;
    private final OrderSagaStateRepository sagaStateRepository;
    private final ObjectMapper objectMapper;

    public List<Long> findProductIdsByCompletedOrders() {
        return orderItemRepository.findProductIdsByCompletedOrders();
    }

    @Transactional
    public OrderVm createOrder(OrderPostVm orderPostVm) {
        OrderAddress shippingAddress = mapAddress(orderPostVm.shippingAddressPostVm());
        OrderAddress billingAddress = mapAddress(orderPostVm.billingAddressPostVm());

        Order order = Order.builder()
                .email(orderPostVm.email())
                .shippingAddressId(shippingAddress)
                .billingAddressId(billingAddress)
                .note(orderPostVm.note())
                .tax(orderPostVm.tax())
                .discount(orderPostVm.discount())
                .numberItem(orderPostVm.numberItem())
                .discount(orderPostVm.discount())
                .totalPrice(orderPostVm.totalPrice())
                .orderStatus(OrderStatus.PENDING)
                .deliveryMethod(orderPostVm.deliveryMethod())
                .deliveryStatus(DeliveryStatus.PREPARING)
                .paymentStatus(orderPostVm.paymentStatus())
                .checkoutId(orderPostVm.checkoutId()).build();
        orderRepository.save(order);

        Set<OrderItem> orderItems = orderPostVm.orderItemPostVmList().stream().map(item ->
                OrderItem.builder()
                        .productId(item.productId())
                        .productName(item.productName())
                        .quantity(item.quantity())
//                       Nên lấy giá từ DB
                        .productPrice(item.productPrice())
                        .note(item.note())
                        .orderId(order.getId())
                        .warehouseId(item.warehouseId())
                        .build()).collect(Collectors.toSet());
        orderItemRepository.saveAll(orderItems);
        OrderVm orderVm = OrderVm.fromModel(order, orderItems);

        // Build structured OrderCreated saga event and write to outbox (same transaction)
        List<OrderItemPayload> itemPayloads = orderItems.stream()
                .map(i -> new OrderItemPayload(i.getProductId(), i.getQuantity(), i.getWarehouseId()))
                .toList();
        OrderCreatedPayload eventPayload = new OrderCreatedPayload(
                order.getId(), itemPayloads, order.getTotalPrice(), order.getCustomerId());

        try {
            String payloadJson = objectMapper.writeValueAsString(
                    new SagaEvent<>(order.getId().toString(), "OrderCreated", eventPayload, ZonedDateTime.now()));
            outboxService.createOutbox(order.getId().toString(), "OrderCreated", payloadJson, SagaTopics.ORDER_EVENTS);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize OrderCreated event", e);
        }

        // Create saga state to track this order's saga lifecycle
        sagaStateRepository.save(OrderSagaState.builder()
                .orderId(order.getId())
                .currentStep("AWAITING_STOCK_RESERVATION")
                .lastEventType("OrderCreated")
                .build());

        // Order stays PENDING — inventory will confirm/reject asynchronously via Kafka
        return orderVm;
    }

    private OrderAddress mapAddress(OrderAddressPostVm dto) {
        if (dto == null) return null;
        return OrderAddress.builder()
                .contactName(dto.contactName())
                .phone(dto.phone())
                .addressLine1(dto.addressLine1())
                .addressLine2(dto.addressLine2())
                .city(dto.city())
                .districtId(dto.districtId())
                .districtName(dto.districtName())
                .stateOrProvinceId(dto.stateOrProvinceId())
                .stateOrProvinceName(dto.stateOrProvinceName())
                .countryId(dto.countryId())
                .countryName(dto.countryName())
                .zipCode(dto.zipCode())
                .build();
    }

    private void acceptOrder(Long orderId) {
        Order order = this.orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", orderId));
        order.setOrderStatus(OrderStatus.ACCEPTED);
        orderRepository.save(order);
    }


    public OrderVm getOrderById(Long id) throws AccessDeniedException {
        Order order = orderRepository.findById(id).orElseThrow();
        String userId = AuthenticationUtils.extractUserId();
        if (!order.getCreatedBy().equals(userId)) {
            throw new AccessDeniedException("ORDER_ACCESS_DENIED");
        }
        Set<OrderItem> orderItemSet = new HashSet<>(orderItemRepository.findByOrderId(order.getId()));
        OrderVm orderVm = OrderVm.fromModel(order, orderItemSet);
        return orderVm;

    }

    public List<OrderVm> getAllOrderByUserId() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        List<Order> orders = orderRepository.findAllByCreatedBy(userId);
        Set<OrderItem> orderItems = new HashSet<>(orderItemRepository.findByOrderId(orders.get(0).getId()));
        if (orderItems.isEmpty()) {
            return List.of();
        }

        return orders.stream().map(order -> {
            Set<OrderItem> orderItemSet = new HashSet<>(orderItemRepository.findByOrderId(order.getId()));
            OrderVm orderVm = OrderVm.fromModel(order, orderItemSet);
            return orderVm;
        }).toList();
    }

    public PaymentOrderStatusVm updateOrderPaymentStatus(@Valid PaymentOrderStatusVm paymentOrderStatusVm) {
        Order order = orderRepository.findById(paymentOrderStatusVm.orderId()).orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", paymentOrderStatusVm.orderId()));

        order.setPaymentId(paymentOrderStatusVm.paymentId());
        order.setPaymentStatus(PaymentStatus.valueOf(paymentOrderStatusVm.paymentStatus()));
        if (PaymentStatus.COMPLETED.equals(PaymentStatus.valueOf(paymentOrderStatusVm.paymentStatus()))) {
            order.setOrderStatus(OrderStatus.PAID);
        }
        Order result = orderRepository.save(order);
        return PaymentOrderStatusVm.builder().orderId(result.getId()).orderStatus(String.valueOf(result.getOrderStatus())).paymentId(result.getPaymentId()).paymentStatus(String.valueOf(result.getPaymentStatus())).build();
    }

    public List<OrderVm> getOrdersByOrderState(String orderState) throws AccessDeniedException {
        OrderStatus orderStatus;
        String userId = AuthenticationUtils.extractUserId();
        if (userId == null || userId.isBlank()) {
            throw new AccessDeniedException("User not authenticated.");
        }
        try {
            orderStatus = OrderStatus.valueOf(orderState);
        } catch (IllegalArgumentException e) {
            return List.of();
        }

        List<Order> order = orderRepository.findAllByOrderStatus(orderStatus);
        List<OrderVm> orderVms = new ArrayList<>();

        if (order == null) {
            return List.of();
        }

        return order.stream().map(item -> {
            List<OrderItem> orderItems = orderItemRepository.findAllByIdAndCreatedBy(item.getId(), userId);
            return OrderVm.fromModel(item, new HashSet<>(orderItems));
        }).toList();
    }
}
