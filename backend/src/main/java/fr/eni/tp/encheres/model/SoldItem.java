package fr.eni.tp.encheres.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "sold_items")
public class SoldItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long soldItemId;

    @Column(nullable = false, length = 30, columnDefinition = "text")
    private String itemName;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Date auctionStartDate;

    @Column(nullable = false)
    private Date auctionEndDate;

    @Column(nullable = false)
    private int startPrice;

    @Column(nullable = false)
    private int sellPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SellState sellState;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "soldItem")
    private List<Auction> auctions;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Embedded
    private PickUp pickUp;
}
