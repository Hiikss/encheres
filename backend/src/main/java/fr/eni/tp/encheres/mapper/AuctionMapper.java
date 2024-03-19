package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.RequestAuctionDto;
import fr.eni.tp.encheres.dto.ResponseAuctionDto;
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
    Auction toAuction(RequestAuctionDto requestAuctionDto);

    @Mapping(target = "bidder", source = "user.pseudo")
    @Mapping(target = "price", source = "auctionPrice")
    @Mapping(target = "date", source = "auctionDate")
    ResponseAuctionDto toAuctionDto(Auction auction);

    List<ResponseAuctionDto> toAuctionDtos(List<Auction> auctions);
}
