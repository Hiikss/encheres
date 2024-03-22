package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.SoldItemResponseDto;
import fr.eni.tp.encheres.dto.SoldItemRequestDto;
import fr.eni.tp.encheres.model.SoldItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SoldItemMapper {

    @Mapping(target = "soldItemId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "auctions", ignore = true)
    @Mapping(target = "category", ignore = true)
    SoldItem toSoldItem(SoldItemRequestDto soldItemRequestDto);

    @Mapping(target = "category", source = "category.label")
    @Mapping(target = "seller", source = "user.pseudo")
    @Mapping(target = "id", source = "soldItemId")
    SoldItemResponseDto toResponseSoldItemDto(SoldItem soldItem);

    List<SoldItemResponseDto> toResponseSoldItemDtoList(List<SoldItem> soldItems);
}
