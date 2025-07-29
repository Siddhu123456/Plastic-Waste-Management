package com.greenbin.repository;

import com.greenbin.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(Long customerId);
    List<Order> findAllByStatusNot(String status);
}
