package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SoldItemResponseDto;
import fr.eni.tp.encheres.dto.SoldItemRequestDto;
import fr.eni.tp.encheres.exception.SoldItemException;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.mapper.SoldItemMapper;
import fr.eni.tp.encheres.model.Category;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.model.User;
import fr.eni.tp.encheres.repository.CategoryRepository;
import fr.eni.tp.encheres.repository.SoldItemRepository;
import fr.eni.tp.encheres.repository.UserRepository;
import fr.eni.tp.encheres.validation.SoldItemValidator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SoldItemServiceImpl implements SoldItemService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SoldItemServiceImpl.class);

    private final SoldItemRepository soldItemRepository;

    private final SoldItemMapper soldItemMapper;

    private final SoldItemValidator soldItemValidator;

    private final UserRepository userRepository;

    private final CategoryRepository categoryRepository;

    @Override
    public List<SoldItemResponseDto> getSoldItems(int page, int size, String itemName, String category, List<String> filters, AuthenticatedUserDto authenticatedUser) {
        LOGGER.info("[Service] : Get sold items");

        String userPseudo = "";
        if (authenticatedUser != null) {
            userPseudo = authenticatedUser.getPseudo();
        }

        Pageable pageable = PageRequest.of(page - 1, Math.min(size, 100));
        List<SoldItem> soldItems = soldItemRepository.findSoldItemsByFilters(pageable, itemName, category, filters, userPseudo);
        return soldItemMapper.toResponseSoldItemDtoList(soldItems);
    }

    @Override
    public long countSoldItems(String itemName, String category, List<String> filters, AuthenticatedUserDto authenticatedUser) {
        LOGGER.info("[Service] : Count sold items");

        String userPseudo = "";
        if (authenticatedUser != null) {
            userPseudo = authenticatedUser.getPseudo();
        }

        return soldItemRepository.countByFilters(itemName, category, filters, userPseudo);
    }

    @Override
    public SoldItemResponseDto getSoldItem(UUID soldItemId) {
        LOGGER.info("[Service] : Get sold item");

        SoldItem soldItem = soldItemRepository.findById(soldItemId)
                .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));
        return soldItemMapper.toResponseSoldItemDto(soldItem);
    }

    @Override
    public SoldItemResponseDto createSell(SoldItemRequestDto requestSoldItem, AuthenticatedUserDto authenticatedUser) {
        LOGGER.info("[Service] : Create sold item");

        soldItemValidator.validateSoldItem(requestSoldItem);

        User user = userRepository.findByPseudo(authenticatedUser.getPseudo())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found"));

        Category category = categoryRepository.findByLabel(requestSoldItem.getCategoryLabel())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "Category not found"));

        SoldItem soldItem = soldItemMapper.toSoldItem(requestSoldItem);
        soldItem.setUser(user);
        soldItem.setCategory(category);

        SoldItem savedSoldItem = soldItemRepository.save(soldItem);
        return soldItemMapper.toResponseSoldItemDto(savedSoldItem);
    }

    @Override
    public SoldItemResponseDto updateSell(UUID soldItemId, SoldItemRequestDto requestSoldItem, AuthenticatedUserDto authenticatedUser) {
        LOGGER.info("[Service] : Update sold item");

        if (Boolean.FALSE.equals(requestSoldItem.getPickUpDone())) {
            soldItemValidator.validateSoldItem(requestSoldItem);
        }

        SoldItem soldItem = soldItemRepository.findById(soldItemId)
                .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));

        if (soldItem.getUser().getPseudo().equals(authenticatedUser.getPseudo()) && (soldItem.getAuctionStartDate().isAfter(LocalDate.now()) || Boolean.TRUE.equals(requestSoldItem.getPickUpDone()))) {
            Category category = categoryRepository.findByLabel(requestSoldItem.getCategoryLabel())
                    .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "Category not found"));

            User user = soldItem.getUser();

            soldItem = soldItemMapper.toSoldItem(requestSoldItem);
            soldItem.setUser(user);
            soldItem.setSoldItemId(soldItemId);
            soldItem.setCategory(category);
            SoldItem savedSoldItem = soldItemRepository.save(soldItem);
            return soldItemMapper.toResponseSoldItemDto(savedSoldItem);
        } else {
            throw new SoldItemException(HttpStatus.FORBIDDEN, "Can't update this sell");
        }
    }

    @Override
    public void deleteSell(UUID soldItemId, AuthenticatedUserDto authenticatedUser) {
        SoldItem soldItem = soldItemRepository.findById(soldItemId)
                .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));

        if (soldItem.getUser().getPseudo().equals(authenticatedUser.getPseudo()) && soldItem.getAuctionStartDate().isAfter(LocalDate.now())) {
            soldItemRepository.deleteById(soldItemId);
        } else {
            throw new SoldItemException(HttpStatus.FORBIDDEN, "Can't delete this sell");
        }
    }
}
