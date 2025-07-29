package com.greenbin.repository;

import com.greenbin.model.ProductFeature;
import com.greenbin.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductFeatureRepository extends JpaRepository<ProductFeature, Long> {
    List<ProductFeature> findByProduct_pId(String pId);  // Modified query method
}
