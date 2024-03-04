package fr.eni.tp.encheres.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue
    private int userId;

    @Column(nullable = false, length = 30)
    private String pseudo;

    @Column(nullable = false, length = 30)
    private String lastname;

    @Column(nullable = false, length = 30)
    private String firstname;

    @Column(nullable = false, length = 10)
    private String phoneNumber;

    @Column(nullable = false, length = 100)
    private String street;

    @Column(nullable = false, length = 5)
    private String postalCode;

    @Column(nullable = false, length = 60)
    private String city;

    @Column(nullable = false, length = 60)
    private String password;

    @Column(nullable = false)
    private int credit;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean admin;

    @OneToMany(mappedBy = "user")
    private List<SoldItem> soldItems;

    @OneToMany(mappedBy = "user")
    private List<Auction> auctions;
}
