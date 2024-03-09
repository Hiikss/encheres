package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SoldItemDto;
import fr.eni.tp.encheres.exception.SoldItemException;
import fr.eni.tp.encheres.mapper.SoldItemMapper;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.repository.SoldItemRepository;
import fr.eni.tp.encheres.validation.SoldItemValidator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SoldItemServiceImpl implements SoldItemService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SoldItemServiceImpl.class);

    private final SoldItemRepository soldItemRepository;

    private final SoldItemMapper soldItemMapper;

    private final SoldItemValidator soldItemValidator;

    @Override
    public List<SoldItem> getSoldItems(int page, int size, String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over, AuthenticatedUserDto authenticatedUser) {
        LOGGER.info("[Service] : Get sold items");

        Pageable pageable = PageRequest.of(page-1, Math.min(size, 100));
        return soldItemRepository.findSoldItemsByFilters(pageable, name, category);
    }

    @Override
    public long countSoldItems(String name, String category, boolean opened, boolean mine, boolean won, boolean inProgress, boolean notStarted, boolean over, AuthenticatedUserDto authenticatedUser) {
        LOGGER.info("[Service] : Count sold items");

        return soldItemRepository.countByFilters(name, category);
    }

    @Override
    public SoldItem getSoldItem(UUID id) {
        LOGGER.info("[Service] : Get sold item");

        return soldItemRepository.findById(id)
                .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));
    }

    @Override
    public SoldItemDto createSell(SoldItemDto requestSoldItem) {
        LOGGER.info("[Service] : Create sold item");

        soldItemValidator.validateSoldItem(requestSoldItem);

        SoldItem soldItem = soldItemMapper.toSoldItem(requestSoldItem);
        SoldItem savedSoldItem = soldItemRepository.save(soldItem);
        return soldItemMapper.toSoldItemDto(savedSoldItem);
    }

    @Override
    public SoldItemDto updateSell(UUID id, SoldItemDto requestSoldItem, AuthenticatedUserDto authenticatedUser) {
        soldItemValidator.validateSoldItem(requestSoldItem);

        SoldItem soldItem = soldItemRepository.findById(id)
                .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));

        if (soldItem.getUser().getUserId() == authenticatedUser.getId()) {
            SoldItem savedSoldItem = soldItemRepository.save(soldItem);
            return soldItemMapper.toSoldItemDto(savedSoldItem);
        } else {
            throw new SoldItemException(HttpStatus.FORBIDDEN, "Can't update this sell");
        }
    }
}
