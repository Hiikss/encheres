package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.SoldItemRequestDto;
import fr.eni.tp.encheres.exception.SoldItemException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class SoldItemValidatorImpl implements SoldItemValidator {

    public void validateSoldItem(SoldItemRequestDto soldItem) {
        if (soldItem.getAuctionStartDate().isBefore(LocalDate.now())) {
            throw new SoldItemException(HttpStatus.BAD_REQUEST, "Auction can't start before today");
        }
        if (soldItem.getAuctionEndDate().isBefore(soldItem.getAuctionStartDate()) || soldItem.getAuctionEndDate().isEqual(soldItem.getAuctionStartDate())) {
            throw new SoldItemException(HttpStatus.BAD_REQUEST, "Auction can't end before the start date");
        }
        if (soldItem.getSellPrice() < soldItem.getStartPrice()) {
            throw new SoldItemException(HttpStatus.BAD_REQUEST, "Sell price can't be less than start price");
        }
        if (Boolean.TRUE.equals(soldItem.getPickUpDone()) && LocalDate.now().isBefore(soldItem.getAuctionEndDate())) {
            throw new SoldItemException(HttpStatus.BAD_REQUEST, "Pick up can't be done before auction is over");
        }
    }
}
