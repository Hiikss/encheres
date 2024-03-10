package fr.eni.tp.encheres.dto;

import java.time.LocalDate;

public record ResponseSoldItemDto(String itemName, String description, LocalDate auctionStartDate, LocalDate auctionEndDate, int startPrice, int sellPrice, String pickUpStreet, String pickUpPostalCode, String pickUpCity, boolean pickUpDone, String category, String lastBidder, String seller) {
}
