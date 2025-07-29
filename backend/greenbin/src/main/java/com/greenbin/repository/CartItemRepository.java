package com.greenbin.repository;

import com.greenbin.model.CartItem;
import com.greenbin.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndProduct(Long userId, Product product);
    void deleteByUserIdAndProduct(Long userId, Product product);
    long countByUserId(Long userId);
    void deleteByUserId(Long userId);
}
