package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CategoryDto;
import fr.eni.tp.encheres.exception.CategoryException;
import fr.eni.tp.encheres.mapper.CategoryMapper;
import fr.eni.tp.encheres.model.Category;
import fr.eni.tp.encheres.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toCategoryDtoList(categories);
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto, AuthenticatedUserDto authenticatedUser) {
        if(authenticatedUser.isAdmin()) {
            Optional<Category> oCategory = categoryRepository.findByLabel(categoryDto.getLabel());

            if (oCategory.isPresent()) {
                throw new CategoryException(HttpStatus.BAD_REQUEST, "Category label already exists");
            }

            Category category = categoryMapper.toCategory(categoryDto);

            Category savedCategory = categoryRepository.save(category);

            return categoryMapper.toCategoryDto(savedCategory);
        }
        throw new CategoryException(HttpStatus.FORBIDDEN, "Can't create category");
    }
}
