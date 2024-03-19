package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.RequestAuctionDto;
import fr.eni.tp.encheres.dto.ResponseAuctionDto;

import java.util.List;
import java.util.UUID;

public interface AuctionService {

    List<ResponseAuctionDto> getSoldItemAuctions(UUID soldItemId);

    void createAuction(RequestAuctionDto requestAuction, AuthenticatedUserDto authenticatedUser);
}
