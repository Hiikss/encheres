package fr.eni.tp.encheres.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false, length = 30)
    private String label;

    @OneToMany(mappedBy = "category")
    private List<SoldItem> soldItems;
}
