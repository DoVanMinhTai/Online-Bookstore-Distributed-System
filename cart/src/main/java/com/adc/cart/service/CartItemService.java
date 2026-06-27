package com.adc.cart.service;

import com.adc.cart.mapper.CartItemMapper;
import com.adc.cart.model.CartItem;
import com.adc.cart.repository.CartItemRepository;
import com.adc.cart.utils.Constant;
import com.adc.cart.viewmodel.CartItemDeleteVms;
import com.adc.cart.viewmodel.CartItemGetVm;
import com.adc.cart.viewmodel.CartItemPost;
import com.adc.cart.viewmodel.CartItemPutVm;
import com.adc.commonlibrary.exception.NotFoundException;
import com.adc.commonlibrary.utils.AuthenticationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final CartItemMapper cartItemMapper;

    @Transactional
    public CartItemGetVm addCartItem(CartItemPost cartItemPost) {
        validateProduct(cartItemPost.productId());
        String currentUser = AuthenticationUtils.extractUserId();
        
        CartItem cartItem = cartItemRepository.findByCustomerIdAndProductId(currentUser, cartItemPost.productId())
                .map(existingItem -> {
                    existingItem.setQuantity(existingItem.getQuantity() + cartItemPost.quantity());
                    return cartItemRepository.save(existingItem);
                })
                .orElseGet(() -> cartItemRepository.save(cartItemMapper.toCartItem(cartItemPost, currentUser)));

        return cartItemMapper.toGetVm(cartItem);
    }

    @Transactional
    public CartItemGetVm updateCartItem(Long productId, CartItemPutVm cartItemPutVm) {
        String currentUser = AuthenticationUtils.extractUserId();
        CartItem cartItem = cartItemRepository.findByCustomerIdAndProductId(currentUser, productId)
                .orElseThrow(() -> new NotFoundException(Constant.ErrorCode.CART_ITEM_NOT_FOUND + " FOR:", productId, currentUser));
        
        cartItem.setQuantity(cartItemPutVm.quantity());
        return cartItemMapper.toGetVm(cartItemRepository.save(cartItem));
    }

    @Transactional(readOnly = true)
    public List<CartItemGetVm> getCartItems() {
        String currentUserId = AuthenticationUtils.extractUserId();
        List<CartItem> items = cartItemRepository.findByCustomerIdOrderByCreatedOnDesc(currentUserId);
        return cartItemMapper.toGetVms(items);
    }

    @Transactional
    public void deleteCartItem(Long productId) {
        String currentUserId = AuthenticationUtils.extractUserId();
        cartItemRepository.deleteByCustomerIdAndProductId(currentUserId, productId);
    }

    @Transactional
    public List<CartItemGetVm> deleteOrAdjustCartItem(List<CartItemDeleteVms> itemsToDelete) {
        String currentUserId = AuthenticationUtils.extractUserId();
        List<Long> productIds = itemsToDelete.stream().map(CartItemDeleteVms::productId).toList();
        
        Map<Long, CartItem> existingCarts = cartItemRepository.findByCustomerIdAndProductIdIn(currentUserId, productIds)
                .stream()
                .collect(Collectors.toMap(CartItem::getProductId, Function.identity()));

        List<CartItem> toUpdate = new ArrayList<>();
        List<CartItem> toDelete = new ArrayList<>();

        for (CartItemDeleteVms request : itemsToDelete) {
            CartItem current = existingCarts.get(request.productId());
            if (current == null) continue;

            if (request.quantity() >= current.getQuantity()) {
                toDelete.add(current);
            } else {
                current.setQuantity(current.getQuantity() - request.quantity());
                toUpdate.add(current);
            }
        }

        if (!toDelete.isEmpty()) cartItemRepository.deleteAll(toDelete);
        List<CartItem> updatedItems = !toUpdate.isEmpty() ? cartItemRepository.saveAll(toUpdate) : Collections.emptyList();
        
        return cartItemMapper.toGetVms(updatedItems);
    }

    private void validateProduct(Long productId) {
        if (!productService.existsProduct(productId)) {
            throw new NotFoundException(Constant.ErrorCode.PRODUCT_NOT_FOUND, productId);
        }
    }
}
