package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.CategoryDto;
import fr.eni.tp.encheres.exception.CategoryException;
import fr.eni.tp.encheres.mapper.CategoryMapper;
import fr.eni.tp.encheres.model.Category;
import fr.eni.tp.encheres.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public void createCategory(CategoryDto categoryDto) {
        Optional<Category> oCategory = categoryRepository.findByLabel(categoryDto.getLabel());

        if (oCategory.isPresent()) {
            throw new CategoryException(HttpStatus.BAD_REQUEST, "Category label already exists");
        }

        Category category = categoryMapper.toCategory(categoryDto);

        categoryRepository.save(category);
    }

    @Override
    public void updateCategory(String label, CategoryDto categoryDto) {
        Category category = categoryRepository.findByLabel(label)
                .orElseThrow(() -> new CategoryException(HttpStatus.NOT_FOUND, "Category not found"));

        Optional<Category> oCategory = categoryRepository.findByLabel(categoryDto.getLabel());

        if (oCategory.isPresent() && oCategory.get().getCategoryId() != category.getCategoryId() && oCategory.get().getLabel().equals(category.getLabel())) {
            throw new CategoryException(HttpStatus.BAD_REQUEST, "Category label already exists");
        }

        category.setLabel(categoryDto.getLabel());

        categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(String label) {
        Optional<Category> oCategory = categoryRepository.findByLabel(label);

        if (oCategory.isEmpty()) {
            throw new CategoryException(HttpStatus.NOT_FOUND, "Category not found");
        }

        categoryRepository.deleteByLabel(label);
    }
}
