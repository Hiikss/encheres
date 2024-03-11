package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.AuctionDto;

public interface AuctionService {

    void createAuction(AuctionDto requestAuction, AuthenticatedUserDto authenticatedUser);
}
