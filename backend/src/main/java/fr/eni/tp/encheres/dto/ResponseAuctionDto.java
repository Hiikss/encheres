package fr.eni.tp.encheres.dto;

import java.time.LocalDate;

public record ResponseAuctionDto(int price, String bidder, LocalDate date) {
}
