package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.ResponseSoldItemDto;
import fr.eni.tp.encheres.dto.RequestSoldItemDto;

import java.util.List;
import java.util.UUID;

public interface SoldItemService {

    ResponseSoldItemDto getSoldItem(UUID soldItemId);

    List<ResponseSoldItemDto> getSoldItems(int page, int size, String itemName, String category, List<String> filters, AuthenticatedUserDto authenticatedUser);

    long countSoldItems(String itemName, String category, List<String> filters, AuthenticatedUserDto authenticatedUser);

    ResponseSoldItemDto createSell(RequestSoldItemDto soldItem, AuthenticatedUserDto authenticatedUser);

    ResponseSoldItemDto updateSell(UUID soldItemId, RequestSoldItemDto soldItem, AuthenticatedUserDto authenticatedUser);

    void deleteSell(UUID soldItemId, AuthenticatedUserDto authenticatedUser);

}
