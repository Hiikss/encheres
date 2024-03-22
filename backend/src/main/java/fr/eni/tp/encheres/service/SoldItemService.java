package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SoldItemResponseDto;
import fr.eni.tp.encheres.dto.SoldItemRequestDto;

import java.util.List;
import java.util.UUID;

public interface SoldItemService {

    SoldItemResponseDto getSoldItem(UUID soldItemId);

    List<SoldItemResponseDto> getSoldItems(int page, int size, String itemName, String category, List<String> filters, AuthenticatedUserDto authenticatedUser);

    long countSoldItems(String itemName, String category, List<String> filters, AuthenticatedUserDto authenticatedUser);

    SoldItemResponseDto createSell(SoldItemRequestDto soldItem, AuthenticatedUserDto authenticatedUser);

    SoldItemResponseDto updateSell(UUID soldItemId, SoldItemRequestDto soldItem, AuthenticatedUserDto authenticatedUser);

    void deleteSell(UUID soldItemId, AuthenticatedUserDto authenticatedUser);

}
