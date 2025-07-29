package com.greenbin.repository;

import com.greenbin.model.Product;
import com.greenbin.projection.ProductIdNameView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category);
    List<ProductIdNameView> findBypNameContainingIgnoreCase(String name);
}
