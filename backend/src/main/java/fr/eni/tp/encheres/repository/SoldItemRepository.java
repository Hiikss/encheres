package fr.eni.tp.encheres.repository;

import fr.eni.tp.encheres.model.SoldItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoldItemRepository extends JpaRepository<SoldItem, Long> {

    @Query("SELECT s FROM SoldItem s WHERE (:name = '' OR s.itemName LIKE '%' || :name || '%') AND (:category = '' OR :category = s.category.label)")
    List<SoldItem> findSoldItemsByFilters(Pageable pageable, String name, String category);

    @Query("SELECT COUNT(s) FROM SoldItem s WHERE (:name = '' OR s.itemName LIKE '%' || :name || '%') AND (:category = '' OR :category = s.category.label)")
    int countByFilters(String name, String category);
}
