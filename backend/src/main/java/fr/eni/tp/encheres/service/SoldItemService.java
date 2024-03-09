package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SoldItemDto;
import fr.eni.tp.encheres.model.SoldItem;

import java.util.List;
import java.util.UUID;

public interface SoldItemService {

    SoldItem getSoldItem(UUID id);

    List<SoldItem> getSoldItems(int page, int size, String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over, AuthenticatedUserDto authenticatedUser);

    long countSoldItems(String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over, AuthenticatedUserDto authenticatedUser);

    SoldItemDto createSell(SoldItemDto soldItem);

    SoldItemDto updateSell(UUID id, SoldItemDto soldItem, AuthenticatedUserDto authenticatedUser);
}
