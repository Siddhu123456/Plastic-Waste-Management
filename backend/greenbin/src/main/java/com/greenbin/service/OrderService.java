package com.greenbin.service;

import com.greenbin.model.Order;
import com.greenbin.model.OrderItem;
import com.greenbin.model.Product;
import com.greenbin.model.Transaction;
import com.greenbin.repository.OrderRepository;
import com.greenbin.repository.ProductRepository;
import com.greenbin.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Order createOrder(Order order) {
        int subTotal = 0;
        StringBuilder productNames = new StringBuilder();

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProduct().getpId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int quantity = item.getQuantity();

            // Check stock availability
            if (product.getStock() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getpName());
            }

            // Decrease stock
            product.setStock(product.getStock() - quantity);
            productRepository.save(product);  // update stock in DB

            item.setOrder(order);
            item.setProduct(product);
            int total = product.getPrice() * quantity;
            item.setTotal(total);
            subTotal += total;

            productNames.append(product.getpName()).append(", ");
        }

        // Remove trailing comma
        if (productNames.length() > 0) {
            productNames.setLength(productNames.length() - 2);
        }

        order.setSubTotal(subTotal);
        Order savedOrder = orderRepository.save(order);

        // Create a debit transaction
        Transaction transaction = new Transaction();
        transaction.setCustomer(order.getCustomer());
        transaction.setType("debit");
        transaction.setAmount(subTotal);
        transaction.setDescription("Shopped: " + productNames);
        transaction.setDate(LocalDate.now());

        transactionRepository.save(transaction);

        return savedOrder;
    }



    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomer(customerId);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }


    public List<Order> getAllOrders(String status){
        return orderRepository.findAllByStatusNot(status);
    }

    public  List<Order> getAll(){
        return orderRepository.findAll();
    }

    public void updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if ("delivered".equals(order.getStatus())) {
            throw new IllegalArgumentException("Cannot update a delivered order");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}
