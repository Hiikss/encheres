package fr.eni.tp.encheres.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID categoryId;

    @Column(nullable = false, length = 30)
    private String label;

    @OneToMany(mappedBy = "category")
    private List<SoldItem> soldItems;
}
