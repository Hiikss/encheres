package fr.eni.tp.encheres.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID auctionId;

    @Column(nullable = false)
    private Date autionDate;

    @Column(nullable = false)
    private int auctionPrize;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "sold_item_id")
    private SoldItem soldItem;
}
