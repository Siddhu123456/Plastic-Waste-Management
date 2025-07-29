package com.greenbin.controller;

import com.greenbin.model.CartItem;
import com.greenbin.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestParam Long userId,
                                              @RequestParam String productId,
                                              @RequestParam int quantity) {

        return ResponseEntity.ok(cartService.addToCart(userId, productId, quantity));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeItem(@RequestParam Long userId,
                                           @RequestParam String productId) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCartItemCount(@RequestParam Long userId) {
        System.out.println(userId);
        long count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam Long userId) {
        System.out.println(userId);
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }


}
