package com.adc.order.service;

import com.adc.commonlibrary.exception.NotFoundException;
import com.adc.commonlibrary.utils.AuthenticationUtils;
import com.adc.commonlibrary.utils.MessagesUtils;
import com.adc.order.mapper.CheckoutMapper;
import com.adc.order.model.Checkout;
import com.adc.order.model.CheckoutItem;
import com.adc.order.model.OrderItem;
import com.adc.order.model.enumeration.CheckoutState;
import com.adc.order.repository.CheckoutItemRepository;
import com.adc.order.repository.CheckoutRepository;
import com.adc.order.utils.Constants;
import com.adc.order.viewmodel.checkout.*;
import com.adc.order.viewmodel.product.ProductCheckoutListVm;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.adc.order.utils.Constants.ErrorCode.CHECKOUT_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CheckoutService {
    private final CheckoutRepository checkoutRepository;
    private final CheckoutMapper checkoutMapper;
    private final ProductService productService;
    private final CheckoutItemRepository checkoutItemRepository;

    public CheckoutVm createCheckout(CheckoutPostVm checkoutPostVm) {
        Checkout checkout = checkoutMapper.toModel(checkoutPostVm);

        checkout.setCustomerId(AuthenticationUtils.extractUserId());
        checkout.setCheckoutState(CheckoutState.PENDING);

        prepareCheckoutItems(checkout, checkoutPostVm);
        checkoutRepository.save(checkout);

        CheckoutVm checkoutVm = checkoutMapper.toVm(checkout);
        Set<CheckoutItemVm> checkoutItemVms = checkout.getCheckoutItems().stream().map(
                        checkoutMapper::toVm)
                .collect(Collectors.toSet());
        return checkoutVm.toBuilder().checkoutItemVms(checkoutItemVms).build();
    }

    private void prepareCheckoutItems(Checkout checkout, CheckoutPostVm checkoutPostVm) {
        Set<Long> productIds = checkoutPostVm.checkoutItemVms()
                .stream()
                .map(CheckOutItemPostVm::productId)
                .collect(Collectors.toSet());

        List<CheckoutItem> checkoutItems = checkoutPostVm.checkoutItemVms()
                .stream()
                .map(checkoutMapper::toModel)
                .map(item -> {
                    item.setCheckout(checkout);
                    return item;
                })
                .toList();

        Map<Long, ProductCheckoutListVm> products =
                productService.getProductInformation(productIds, 0, productIds.size());

        List<CheckoutItem> enrichedItems = enrichCheckoutItemWithProductDetails(products, checkoutItems);

        BigDecimal totalAmount = enrichedItems.stream().map(
                        item -> item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        checkout.setCheckoutItems(enrichedItems);
        checkout.setTotalAmount(totalAmount);
    }

    private List<CheckoutItem> enrichCheckoutItemWithProductDetails(Map<Long, ProductCheckoutListVm> products,
                                                                    List<CheckoutItem> checkoutItems) {
        return checkoutItems.stream().map(item -> {
            ProductCheckoutListVm product = products.get(item.getProductId());
            if (product == null) {
                throw new NotFoundException(MessagesUtils.getMessage("PRODUCT_NOT_FOUND", item.getProductId()));
            }
            return item.toBuilder()
                    .productName(product.getName())
                    .productPrice(BigDecimal.valueOf(product.getPrice()))
                    .build();
        }).toList();
    }

    public void updateCheckoutPaymentMethod(String id, @Valid CheckoutPaymentMethodPutVm checkoutPaymentMethodPutVm) {
        Checkout checkout = checkoutRepository.findById(id).orElseThrow(() -> new NotFoundException(CHECKOUT_NOT_FOUND, id));
        checkout.setPaymentMethodId(checkoutPaymentMethodPutVm.paymentMethodId());
        log.info(Constants.MessageCode.UPDATE_CHECKOUT_PAYMENT,
                checkout.getId(),
                checkoutPaymentMethodPutVm.paymentMethodId(),
                checkout.getPaymentMethodId()
        );
        checkoutRepository.save(checkout);
    }

    public CheckoutVm getCheckoutWithPendingStateById(String id) {
        Checkout checkout = checkoutRepository.findByIdAndCheckoutState(id, CheckoutState.PENDING);

        if (checkout == null || isNotOwnerByCurrentUser(checkout)) {
            throw new NotFoundException(CHECKOUT_NOT_FOUND, id);
        }

        Set<CheckoutItemVm> checkoutItems = checkout.getCheckoutItems().stream().map(checkoutMapper::toVm).collect(Collectors.toSet());
        CheckoutVm checkoutVm = checkoutMapper.toVm(checkout);
        checkoutVm = checkoutVm.toBuilder().checkoutItemVms(checkoutItems).build();

        return checkoutVm;
    }

    private boolean isNotOwnerByCurrentUser(Checkout checkout) {
        String userId = AuthenticationUtils.extractUserId();
        return checkout == null || checkout.getCreatedBy() == null || !checkout.getCreatedBy().equals(userId);
    }

    public Long updateCheckoutStatus(@Valid CheckoutStatusPutVm checkoutStatusPutVm) {
        Checkout checkout = checkoutRepository.findById(checkoutStatusPutVm.checkoutId()).orElseThrow(() -> new NotFoundException(CHECKOUT_NOT_FOUND, checkoutStatusPutVm.checkoutId()));
        checkout.setCheckoutState(CheckoutState.valueOf(checkoutStatusPutVm.checkoutStatus()));
        checkoutRepository.save(checkout);
        return Long.valueOf(checkout.getId());
    }
}
