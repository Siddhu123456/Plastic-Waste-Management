package com.greenbin.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "pickups")
public class Pickup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customer;

    private LocalDate requestedDate = LocalDate.now();

    private LocalDate pickedDate;

    private Long address;

    private String status = "pending";

    private int weight;

    private int GreenCoinsEarned;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomer() {
        return customer;
    }

    public void setCustomer(Long customer) {
        this.customer = customer;
    }

    public LocalDate getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(LocalDate requestedDate) {
        this.requestedDate = requestedDate;
    }

    public LocalDate getPickedDate() {
        return pickedDate;
    }

    public void setPickedDate(LocalDate pickedDate) {
        this.pickedDate = pickedDate;
    }

    public Long getAddress() {
        return address;
    }

    public void setAddress(Long address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public int getGreenCoinsEarned() {
        return GreenCoinsEarned;
    }

    public void setGreenCoinsEarned(int greenCoinsEarned) {
        GreenCoinsEarned = greenCoinsEarned;
    }

}
