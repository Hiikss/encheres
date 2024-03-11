package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.ResponseSoldItemDto;
import fr.eni.tp.encheres.dto.RequestSoldItemDto;
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
    SoldItem toSoldItem(RequestSoldItemDto requestSoldItemDto);

    @Mapping(target = "category", source = "category.label")
    @Mapping(target = "lastBidder", expression = "java(soldItem.getAuctions() != null && !soldItem.getAuctions().isEmpty() ? soldItem.getAuctions().stream().max(java.util.Comparator.comparingInt(fr.eni.tp.encheres.model.Auction::getAuctionPrice)).map(a -> a.getUser().getPseudo()).orElse(null) : null)")
    @Mapping(target = "seller", source = "user.pseudo")
    @Mapping(target = "id", source = "soldItemId")
    ResponseSoldItemDto toResponseSoldItemDto(SoldItem soldItem);

    List<ResponseSoldItemDto> toResponseSoldItemDtoList(List<SoldItem> soldItems);
}
