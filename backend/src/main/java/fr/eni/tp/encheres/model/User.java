package fr.eni.tp.encheres.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(nullable = false, length = 30, unique = true)
    private String pseudo;

    @Column(nullable = false, length = 30)
    private String lastname;

    @Column(nullable = false, length = 30)
    private String firstname;

    @Column(nullable = false, unique = true)
    private String email;

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

    @Column(nullable = false)
    private boolean admin;

    @Column(nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "user")
    private List<SoldItem> soldItems;

    @OneToMany(mappedBy = "user")
    private List<Auction> auctions;
}
