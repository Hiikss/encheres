package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getCategories();

    void createCategory(CategoryDto categoryDto);

    void updateCategory(String label, CategoryDto categoryDto);

    void deleteCategory(String label);
}
