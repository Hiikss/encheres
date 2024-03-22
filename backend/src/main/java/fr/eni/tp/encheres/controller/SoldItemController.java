package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SoldItemResponseDto;
import fr.eni.tp.encheres.dto.SoldItemRequestDto;
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

    @GetMapping("/{soldItemId}")
    public ResponseEntity<SoldItemResponseDto> getSoldItem(@PathVariable UUID soldItemId) {
        LOGGER.info("[Controller] : Get sold item");

        return ResponseEntity.ok().body(soldItemService.getSoldItem(soldItemId));
    }

    @GetMapping
    public ResponseEntity<List<SoldItemResponseDto>> getSoldItems(@RequestParam(defaultValue = "1") int page,
                                                                  @RequestParam(defaultValue = "10") int size,
                                                                  @RequestParam(defaultValue = "") String itemName,
                                                                  @RequestParam(defaultValue = "") String category,
                                                                  @RequestParam(defaultValue = "") List<String> filters,
                                                                  Authentication authentication) {
        LOGGER.info("[Controller] : Get sold items");
        AuthenticatedUserDto authenticatedUser = null;
        if (authentication != null) {
            authenticatedUser = (AuthenticatedUserDto) authentication.getPrincipal();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", Long.toString(soldItemService.countSoldItems(itemName, category, filters, authenticatedUser)));
        headers.setAccessControlExposeHeaders(List.of("X-Total-Count"));
        return ResponseEntity.status(HttpStatus.OK)
                .headers(headers)
                .body(soldItemService.getSoldItems(page, size, itemName, category, filters, authenticatedUser));
    }

    @PostMapping
    public ResponseEntity<SoldItemResponseDto> createSell(@Valid @RequestBody SoldItemRequestDto soldItem, Authentication authentication) {
        LOGGER.info("[Controller] : Create sold item");

        return ResponseEntity.status(HttpStatus.CREATED).body(soldItemService.createSell(soldItem, (AuthenticatedUserDto) authentication.getPrincipal()));
    }

    @PutMapping("/{soldItemId}")
    public ResponseEntity<SoldItemResponseDto> updateSell(@PathVariable UUID soldItemId, @Valid @RequestBody SoldItemRequestDto soldItem, Authentication authentication) {
        LOGGER.info("[Controller] : Update sold item");

        return ResponseEntity.ok().body(soldItemService.updateSell(soldItemId, soldItem, (AuthenticatedUserDto) authentication.getPrincipal()));
    }

    @DeleteMapping("/{soldItemId}")
    public ResponseEntity<String> deleteSell(@PathVariable UUID soldItemId, Authentication authentication) {
        LOGGER.info("[Controller] : Delete sold item");

        soldItemService.deleteSell(soldItemId, (AuthenticatedUserDto) authentication.getPrincipal());
        return ResponseEntity.ok().body("Sold item deleted");
    }
}
