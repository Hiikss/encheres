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

    @Query("SELECT s FROM SoldItem s WHERE (:itemName = '' OR s.itemName LIKE '%' || :itemName || '%') AND (:category = '' OR :category = s.category.label) AND ('opened' NOT IN :filters OR ('opened' IN :filters AND s.auctionStartDate <= CURRENT_DATE() AND s.auctionEndDate > CURRENT_DATE()))")
    List<SoldItem> findSoldItemsByFilters(Pageable pageable, String itemName, String category, List<String> filters);

    @Query("SELECT COUNT(s) FROM SoldItem s WHERE (:itemName = '' OR s.itemName LIKE '%' || :itemName || '%') AND (:category = '' OR :category = s.category.label)")
    int countByFilters(String itemName, String category);
}
