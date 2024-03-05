package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.service.SoldItemService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/solditems")
@RequiredArgsConstructor
public class SoldItemController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SoldItemController.class);

    private final SoldItemService soldItemService;

    @GetMapping
    public ResponseEntity<List<SoldItem>> getSoldItems(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "") String name, @RequestParam(defaultValue = "") String category, @RequestParam(defaultValue = "true") boolean opened, @RequestParam(defaultValue = "false") boolean mine, @RequestParam(defaultValue = "false") boolean won, @RequestParam(defaultValue = "false") boolean inProgress, @RequestParam(defaultValue = "false") boolean notStarted, @RequestParam(defaultValue = "false") boolean over) {
        LOGGER.info("[Controller] : Get sold items");

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", Long.toString(soldItemService.countSoldItems(name, category, opened, mine, won, inProgress, notStarted, over)));
        return ResponseEntity.status(HttpStatus.OK).headers(headers).body(soldItemService.getSoldItems(page, size, name, category, opened, mine, won, inProgress, notStarted, over));
    }

    @GetMapping("/{id}")
    public Optional<SoldItem> getSoldItem(@PathVariable Long id) {
        LOGGER.info("[Controller] : Get sold item");

        return soldItemService.getSoldItem(id);
    }

    @PostMapping
    public void createSell(@RequestBody SoldItem soldItem) {
        LOGGER.info("[Controller] : Create sold items");

        soldItemService.createSell(soldItem);
    }
}
