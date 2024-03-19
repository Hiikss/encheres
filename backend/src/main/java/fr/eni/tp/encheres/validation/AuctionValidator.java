package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.RequestAuctionDto;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.model.User;

public interface AuctionValidator {

    void validateAuction(RequestAuctionDto requestAuction, SoldItem soldItem, User user);
}
