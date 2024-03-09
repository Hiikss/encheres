package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SoldItemDto;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.service.SoldItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/solditems")
@RequiredArgsConstructor
@Validated
public class SoldItemController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SoldItemController.class);

    private final SoldItemService soldItemService;

    @GetMapping("/{id}")
    public ResponseEntity<SoldItem> getSoldItem(@PathVariable UUID id) {
        LOGGER.info("[Controller] : Get sold item");

        return ResponseEntity.ok().body(soldItemService.getSoldItem(id));
    }

    @GetMapping
    public ResponseEntity<List<SoldItem>> getSoldItems(@RequestParam(defaultValue = "1") int page,
                                                       @RequestParam(defaultValue = "10") int size,
                                                       @RequestParam(defaultValue = "") String name,
                                                       @RequestParam(defaultValue = "") String category,
                                                       @RequestParam(defaultValue = "true") boolean opened,
                                                       @RequestParam(defaultValue = "false") boolean mine,
                                                       @RequestParam(defaultValue = "false") boolean won,
                                                       @RequestParam(defaultValue = "false") boolean inProgress,
                                                       @RequestParam(defaultValue = "false") boolean notStarted,
                                                       @RequestParam(defaultValue = "false") boolean over,
                                                       Authentication authentication) {
        LOGGER.info("[Controller] : Get sold items");
        AuthenticatedUserDto authenticatedUser = null;
        if (authentication != null) {
            authenticatedUser = (AuthenticatedUserDto) authentication.getPrincipal();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", Long.toString(soldItemService.countSoldItems(name, category, opened, mine, won, inProgress, notStarted, over, authenticatedUser)));
        return ResponseEntity.status(HttpStatus.OK)
                .headers(headers)
                .body(soldItemService.getSoldItems(page, size, name, category, opened, mine, won, inProgress, notStarted, over, authenticatedUser));
    }

    @PostMapping
    public ResponseEntity<SoldItemDto> createSell(@Valid @RequestBody SoldItemDto soldItem) {
        LOGGER.info("[Controller] : Create sold item");

        return ResponseEntity.status(HttpStatus.CREATED).body(soldItemService.createSell(soldItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SoldItemDto> updateSell(@PathVariable UUID id, @Valid @RequestBody SoldItemDto soldItem, Authentication authentication) {
        LOGGER.info("[Controller] : Update sold item");

        return ResponseEntity.ok().body(soldItemService.updateSell(id, soldItem, (AuthenticatedUserDto) authentication.getPrincipal()));
    }

    @DeleteMapping("/{id}")
    public void deleteSell(@PathVariable UUID id) {
        LOGGER.info("[Controller] : Delete sold item");

//        soldItemService.deleteSell(id);
    }
}
