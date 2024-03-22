package fr.eni.tp.encheres.dto;

import java.time.LocalDate;
import java.util.UUID;

public record SoldItemResponseDto(UUID id, String itemName, String description, String imageUrl, LocalDate auctionStartDate, LocalDate auctionEndDate, int startPrice, int sellPrice, String pickUpStreet, String pickUpPostalCode, String pickUpCity, boolean pickUpDone, String category, String seller) {
}
