package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.AuctionRequestDto;
import fr.eni.tp.encheres.dto.AuctionResponseDto;

import java.util.List;
import java.util.UUID;

public interface AuctionService {

    List<AuctionResponseDto> getSoldItemAuctions(UUID soldItemId);

    void createAuction(AuctionRequestDto requestAuction, AuthenticatedUserDto authenticatedUser);
}
