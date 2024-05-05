package fr.eni.tp.encheres.repository;

import fr.eni.tp.encheres.model.SoldItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SoldItemRepository extends JpaRepository<SoldItem, UUID> {

    @Query("SELECT s FROM SoldItem s " +
            "WHERE (:itemName = '' OR LOWER(s.itemName) LIKE '%' || LOWER(:itemName) || '%') " +
            "AND (:category = '' OR :category = s.category.label) " +
            "AND (('opened' IN :filters AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE()) " +
            "OR ('mine' IN :filters AND s IN (SELECT s1 FROM SoldItem s1, Auction a WHERE s1 = a.soldItem AND a.user.pseudo = :pseudo)) " +
            "OR ('won' IN :filters AND s IN (SELECT s1 FROM SoldItem s1, Auction a WHERE s1.auctionEndDate <= CURRENT_DATE() AND a.auctionPrice = (SELECT MAX(a1.auctionPrice) from Auction a1 WHERE s1 = a1.soldItem AND a1.user.pseudo = :pseudo)))" +
            "OR ('inProgress' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE())" +
            "OR ('notStarted' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate > CURRENT_DATE())" +
            "OR ('over' IN :filters AND s.user.pseudo = :pseudo AND s.auctionEndDate <= CURRENT_DATE()))" +
            "ORDER BY s.auctionStartDate DESC")
    List<SoldItem> findSoldItemsByFilters(Pageable pageable, String itemName, String category, List<String> filters, String pseudo);

    @Query("SELECT COUNT(s) FROM SoldItem s " +
            "WHERE (:itemName = '' OR LOWER(s.itemName) LIKE '%' || LOWER(:itemName) || '%') " +
            "AND (:category = '' OR :category = s.category.label) " +
            "AND (('opened' IN :filters AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE()) " +
            "OR ('mine' IN :filters AND s IN (SELECT s1 FROM SoldItem s1, Auction a WHERE s1 = a.soldItem AND a.user.pseudo = :pseudo)) " +
            "OR ('won' IN :filters AND s IN (SELECT s1 FROM SoldItem s1, Auction a WHERE s1.auctionEndDate <= CURRENT_DATE() AND a.auctionPrice = (SELECT MAX(a1.auctionPrice) from Auction a1 WHERE s1 = a1.soldItem AND a1.user.pseudo = :pseudo)))" +
            "OR ('inProgress' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE())" +
            "OR ('notStarted' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate > CURRENT_DATE())" +
            "OR ('over' IN :filters AND s.user.pseudo = :pseudo AND s.auctionEndDate <= CURRENT_DATE()))")
    int countByFilters(String itemName, String category, List<String> filters, String pseudo);
}
