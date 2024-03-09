package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.SoldItemDto;
import fr.eni.tp.encheres.model.SoldItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SoldItemMapper {

    SoldItemDto toSoldItemDto(SoldItem soldItem);

    @Mapping(target = "soldItemId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "auctions", ignore = true)
    @Mapping(target = "category", ignore = true)
    SoldItem toSoldItem(SoldItemDto soldItemDto);
}
