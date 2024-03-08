package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.model.SoldItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SoldItemService {

    List<SoldItem> getSoldItems(int page, int size, String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over);

    long countSoldItems(String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over);

    Optional<SoldItem> getSoldItem(UUID id);

    void createSell(SoldItem soldItem);
}
