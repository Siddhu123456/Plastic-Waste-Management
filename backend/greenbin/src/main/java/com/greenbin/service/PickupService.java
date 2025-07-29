package com.greenbin.service;

import com.greenbin.model.Pickup;
import com.greenbin.model.Transaction;
import com.greenbin.repository.PickupRepository;
import com.greenbin.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PickupService {

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    public Pickup createPickup(Pickup pickup) {
        pickup.setStatus(pickup.getStatus() != null ? pickup.getStatus() : "pending");
        pickup.setPickedDate(null);
        pickup.setGreenCoinsEarned(0);
        return pickupRepository.save(pickup);
    }

    public List<Pickup> getOrdersByCustomerId(Long customerId){
        return pickupRepository.findByCustomer(customerId);
    }

    public List<Pickup> getAllPickups(String status){
        return pickupRepository.findAllByStatusOrderByRequestedDateAsc(status);
    }

    public  List<Pickup> getAll(){
        return pickupRepository.findAll();
    }

    public void updatePickupStatus(Long pickupId, String newStatus) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new NoSuchElementException("Pickup not found"));

        if ("picked".equals(pickup.getStatus())) {
            throw new IllegalArgumentException("Cannot update a picked status");
        }

        pickup.setStatus(newStatus);
        if ("picked".equals(newStatus)) {
            int greenCoins = (int) (pickup.getWeight() * 15);
            pickup.setGreenCoinsEarned(greenCoins);

            Transaction transaction = new Transaction();
            transaction.setCustomer(pickup.getCustomer()); // Assuming Pickup has a getUser() method
            transaction.setType("credit");
            transaction.setAmount(greenCoins);
            transaction.setDescription("Waste pickup of " + pickup.getWeight() +" kg");
            transaction.setDate(LocalDate.now());

            transactionRepository.save(transaction);
        }
        pickupRepository.save(pickup);
    }
}
