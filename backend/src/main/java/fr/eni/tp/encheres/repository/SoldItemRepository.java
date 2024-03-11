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
            "WHERE (:itemName IS NULL OR s.itemName LIKE '%' || :itemName || '%') " +
            "AND (:category IS NULL OR :category = s.category.label) " +
            "AND ('opened' NOT IN :filters OR ('opened' IN :filters AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE())) " +
            "AND (('mine' NOT IN :filters OR :pseudo IS NULL) OR ('mine' IN :filters AND s IN (SELECT s FROM SoldItem s, Auction a WHERE s = a.soldItem AND a.user.pseudo = :pseudo))) " +
            "AND (('won' NOT IN :filters OR :pseudo IS NULL) OR ('won' IN :filters AND s IN (SELECT s FROM SoldItem s, Auction a WHERE s.auctionEndDate <= CURRENT_DATE() AND s.sellPrice = a.auctionPrice AND s = a.soldItem AND a.user.pseudo = :pseudo)))" +
            "AND (('inProgress' NOT IN :filters OR :pseudo IS NULL) OR ('inProgress' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE()))" +
            "AND (('notStarted' NOT IN :filters OR :pseudo IS NULL) OR ('notStarted' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate > CURRENT_DATE()))" +
            "AND (('over' NOT IN :filters OR :pseudo IS NULL) OR ('over' IN :filters AND s.user.pseudo = :pseudo AND s.auctionEndDate <= CURRENT_DATE()))")
    List<SoldItem> findSoldItemsByFilters(Pageable pageable, String itemName, String category, List<String> filters, String pseudo);

    @Query("SELECT COUNT(s) FROM SoldItem s " +
            "WHERE (:itemName IS NULL OR s.itemName LIKE '%' || :itemName || '%') " +
            "AND (:category IS NULL OR :category = s.category.label) " +
            "AND ('opened' NOT IN :filters OR ('opened' IN :filters AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE())) " +
            "AND (('mine' NOT IN :filters OR :pseudo IS NULL) OR ('mine' IN :filters AND s IN (SELECT s FROM SoldItem s, Auction a WHERE s = a.soldItem AND a.user.pseudo = :pseudo))) " +
            "AND (('won' NOT IN :filters OR :pseudo IS NULL) OR ('won' IN :filters AND s IN (SELECT s FROM SoldItem s, Auction a WHERE s.auctionEndDate <= CURRENT_DATE() AND s.sellPrice = a.auctionPrice AND s = a.soldItem AND a.user.pseudo = :pseudo)))" +
            "AND (('inProgress' NOT IN :filters OR :pseudo IS NULL) OR ('inProgress' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE()))" +
            "AND (('notStarted' NOT IN :filters OR :pseudo IS NULL) OR ('notStarted' IN :filters AND s.user.pseudo = :pseudo AND s.auctionStartDate > CURRENT_DATE()))" +
            "AND (('over' NOT IN :filters OR :pseudo IS NULL) OR ('over' IN :filters AND s.user.pseudo = :pseudo AND s.auctionEndDate <= CURRENT_DATE()))")
    int countByFilters(String itemName, String category);
}
