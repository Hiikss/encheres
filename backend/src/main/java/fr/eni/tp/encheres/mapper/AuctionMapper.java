package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.AuctionDto;
import fr.eni.tp.encheres.model.Auction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuctionMapper {

    @Mapping(target = "auctionId", ignore = true)
    @Mapping(target = "auctionDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "soldItem", ignore = true)
    Auction toAuction(AuctionDto auctionDto);
}
