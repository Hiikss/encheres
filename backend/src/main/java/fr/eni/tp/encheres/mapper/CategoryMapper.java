package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.CategoryDto;
import fr.eni.tp.encheres.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDto toCategoryDto(Category category);

    List<CategoryDto> toCategoryDtoList(List<Category> category);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "soldItems", ignore = true)
    Category toCategory(CategoryDto category);

}
