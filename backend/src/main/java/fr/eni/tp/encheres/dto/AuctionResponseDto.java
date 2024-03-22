package fr.eni.tp.encheres.dto;

import java.time.LocalDate;

public record AuctionResponseDto(int price, String bidder, LocalDate date) {
}
