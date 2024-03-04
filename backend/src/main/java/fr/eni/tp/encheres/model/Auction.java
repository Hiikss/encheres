package fr.eni.tp.encheres.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue
    private Long auctionId;

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
