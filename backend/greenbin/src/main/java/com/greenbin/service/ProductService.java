package com.greenbin.service;

import com.greenbin.model.Product;
import com.greenbin.model.ProductImage;
import com.greenbin.model.ProductFeature;
import com.greenbin.projection.ProductIdNameView;
import com.greenbin.repository.ProductRepository;
import com.greenbin.repository.ProductImageRepository;
import com.greenbin.repository.ProductFeatureRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductFeatureRepository productFeatureRepository;

    public Product getProductDetails(String pId) {
        Product product = productRepository.findById(pId).orElse(null);
        if (product != null) {
            List<ProductImage> images = productImageRepository.findByProduct_pId(pId);
            List<ProductFeature> features = productFeatureRepository.findByProduct_pId(pId);

            product.setImages(images);
            product.setFeatures(features);
        }
        return product;
    }

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<ProductIdNameView> getProductIdAndNamesByName(String name) {
        return productRepository.findBypNameContainingIgnoreCase(name);
    }

    @Transactional
    public Product saveProduct(Product product) {
        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(product);
            }
        }
        if (product.getFeatures() != null) {
            for (ProductFeature feature : product.getFeatures()) {
                feature.setProduct(product);
            }
        }
        return productRepository.save(product);
    }

}
