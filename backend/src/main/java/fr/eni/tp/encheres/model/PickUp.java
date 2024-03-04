package fr.eni.tp.encheres.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PickUp {

    @Column(length = 100)
    private String street;
    @Column(length = 5)
    private String postalCode;

    @Column(length = 60)
    private String city;
}