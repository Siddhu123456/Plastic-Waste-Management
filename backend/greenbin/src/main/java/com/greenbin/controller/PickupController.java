package com.greenbin.controller;

import com.greenbin.model.Pickup;
import com.greenbin.service.PickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/pickups")
@CrossOrigin(origins = "*") // Adjust this for security
public class PickupController {

    @Autowired
    private PickupService pickupService;

    @PostMapping("/create")
    public ResponseEntity<Pickup> createPickup(@RequestBody Pickup pickup) {
        Pickup createdPickup = pickupService.createPickup(pickup);
        return ResponseEntity.ok(createdPickup);
    }

    @GetMapping("/user/{userId}")
    public List<Pickup> getPickupsByCustomerId(@PathVariable Long userId) {
        return pickupService.getOrdersByCustomerId(userId);
    }

    @GetMapping("/status/{status}")
    public List<Pickup> getAllPickups(@PathVariable String status){
        return pickupService.getAllPickups(status);
    }

    @GetMapping("/all")
    public List<Pickup> getAll(){
        return pickupService.getAll();
    }

    @PutMapping("/update/{id}/status")
    public ResponseEntity<?> updatePickupStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");

        try {
            pickupService.updatePickupStatus(id, newStatus);
            return ResponseEntity.ok().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
