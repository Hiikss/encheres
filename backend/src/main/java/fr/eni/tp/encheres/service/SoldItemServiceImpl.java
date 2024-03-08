package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.repository.SoldItemRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SoldItemServiceImpl implements SoldItemService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SoldItemServiceImpl.class);
    private final SoldItemRepository soldItemRepository;

    @Override
    public List<SoldItem> getSoldItems(int page, int size, String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over) {
        LOGGER.info("[Service] : Get sold items");

        Pageable pageable = PageRequest.of(page-1, Math.min(size, 100));
        return soldItemRepository.findSoldItemsByFilters(pageable, name, category);
    }

    @Override
    public long countSoldItems(String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over) {
        LOGGER.info("[Service] : Count sold items");

        return soldItemRepository.countByFilters(name, category);
    }

    @Override
    public Optional<SoldItem> getSoldItem(UUID id) {
        LOGGER.info("[Service] : Get sold item");

        return soldItemRepository.findById(id);
    }

    @Override
    public void createSell(SoldItem soldItem) {
        LOGGER.info("[Service] : Create sold item");

        soldItemRepository.save(soldItem);
    }
}
