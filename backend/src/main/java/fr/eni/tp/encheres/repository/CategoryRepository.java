package fr.eni.tp.encheres.repository;

import fr.eni.tp.encheres.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findByLabel(String label);

    void deleteByLabel(String label);
}
