package com.greenbin.repository;

import com.greenbin.model.Pickup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PickupRepository extends JpaRepository<Pickup, Long> {
    List<Pickup> findByCustomer(Long customerId);
    List<Pickup> findAllByStatusOrderByRequestedDateAsc(String status);
}
