package com.greenbin.service;

import com.greenbin.model.CartItem;
import com.greenbin.model.Product;
import com.greenbin.repository.CartItemRepository;
import com.greenbin.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private ProductRepository productRepo;

    public CartItem addToCart(Long userId, String productId, int quantity) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepo.findByUserIdAndProduct(userId, product)
                .orElse(new CartItem());

        cartItem.setUserId(userId);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);

        return cartItemRepo.save(cartItem);
    }

    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepo.findByUserId(userId);
    }

    @Transactional
    public void removeItem(Long userId, String productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        cartItemRepo.deleteByUserIdAndProduct(userId, product);
    }

    public long getCartItemCount(Long userId) {
        return cartItemRepo.countByUserId(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepo.deleteByUserId(userId);
    }}

