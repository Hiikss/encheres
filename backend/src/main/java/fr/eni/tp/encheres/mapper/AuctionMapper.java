package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.AuctionRequestDto;
import fr.eni.tp.encheres.dto.AuctionResponseDto;
import fr.eni.tp.encheres.model.Auction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuctionMapper {

    @Mapping(target = "auctionId", ignore = true)
    @Mapping(target = "auctionDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "soldItem", ignore = true)
    Auction toAuction(AuctionRequestDto auctionRequestDto);

    @Mapping(target = "bidder", source = "user.pseudo")
    @Mapping(target = "price", source = "auctionPrice")
    @Mapping(target = "date", source = "auctionDate")
    AuctionResponseDto toAuctionDto(Auction auction);

    List<AuctionResponseDto> toAuctionDtos(List<Auction> auctions);
}
