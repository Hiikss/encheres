package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.AuctionRequestDto;
import fr.eni.tp.encheres.exception.AuctionException;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AuctionValidatorImpl implements AuctionValidator {


    @Override
    public void validateAuction(AuctionRequestDto requestAuction, SoldItem soldItem, User user) {
        if (soldItem.getAuctionStartDate().isAfter(LocalDate.now()) && soldItem.getAuctionEndDate().isEqual(LocalDate.now()) && soldItem.getAuctionEndDate().isBefore(LocalDate.now())) {
            throw new AuctionException(HttpStatus.BAD_REQUEST, "Can't bid an over sell");
        }

        if(soldItem.getUser().getUserId().equals(user.getUserId())) {
            throw new AuctionException(HttpStatus.BAD_REQUEST, "Seller can't bid his own sell");
        }

        if(requestAuction.getAuctionPrice() <= soldItem.getSellPrice()) {
            throw new AuctionException(HttpStatus.BAD_REQUEST, "Auction price can't be less than the current sell price");
        }

        if(requestAuction.getAuctionPrice() > user.getCredit()) {
            throw new AuctionException(HttpStatus.BAD_REQUEST, "Auction price can't be greater than the user credit");
        }
    }
}
