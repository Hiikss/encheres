package fr.eni.tp.encheres.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sold_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoldItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID soldItemId;

    @Column(nullable = false, length = 30)
    private String itemName;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false, columnDefinition = "text")
    private String imageUrl;

    @Column(nullable = false)
    private LocalDate auctionStartDate;

    @Column(nullable = false)
    private LocalDate auctionEndDate;

    @Column(nullable = false)
    private int startPrice;

    @Column(nullable = false)
    private int sellPrice;

    @Column(length = 100)
    private String pickUpStreet;

    @Column(length = 5)
    private String pickUpPostalCode;

    @Column(length = 60)
    private String pickUpCity;

    @Column(nullable = false)
    private boolean pickUpDone;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "soldItem")
    private List<Auction> auctions;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
