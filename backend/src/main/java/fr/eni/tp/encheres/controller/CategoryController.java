package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CategoryDto;
import fr.eni.tp.encheres.exception.CategoryException;
import fr.eni.tp.encheres.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Validated
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok().body(categoryService.getCategories());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createCategory(@Valid @RequestBody CategoryDto category, Authentication authentication) {
        if(!((AuthenticatedUserDto) authentication.getPrincipal()).isAdmin()) {
            throw new CategoryException(HttpStatus.FORBIDDEN, "Can't create category");
        }
        categoryService.createCategory(category);
    }

    @PutMapping("/{label}")
    @ResponseStatus(HttpStatus.OK)
    public void updateCategory(@PathVariable String label, @Valid @RequestBody CategoryDto category, Authentication authentication) {
        if(!((AuthenticatedUserDto) authentication.getPrincipal()).isAdmin()) {
            throw new CategoryException(HttpStatus.FORBIDDEN, "Can't update category");
        }
        categoryService.updateCategory(label, category);
    }

    @DeleteMapping("/{label}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCategory(@PathVariable String label, Authentication authentication) {
        if(!((AuthenticatedUserDto) authentication.getPrincipal()).isAdmin()) {
            throw new CategoryException(HttpStatus.FORBIDDEN, "Can't delete category");
        }
        categoryService.deleteCategory(label);
    }
}
