package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getCategories();

    CategoryDto createCategory(CategoryDto categoryDto, AuthenticatedUserDto authenticatedUser);
}
