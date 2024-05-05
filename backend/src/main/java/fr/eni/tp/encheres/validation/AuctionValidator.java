package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.AuctionRequestDto;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.model.User;

public interface AuctionValidator {

    void validateAuction(AuctionRequestDto requestAuction, SoldItem soldItem, User user);
}
