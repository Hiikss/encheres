package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.repository.SoldItemRepository;
import org.springframework.stereotype.Service;

@Service
public class SoldItemServiceImpl implements SoldItemService {

    private final SoldItemRepository soldItemRepository;

    public SoldItemServiceImpl(SoldItemRepository soldItemRepository) {
        this.soldItemRepository = soldItemRepository;
    }

    @Override
    public void createSell(SoldItem soldItem) {
        soldItemRepository.save(soldItem);
    }
}
