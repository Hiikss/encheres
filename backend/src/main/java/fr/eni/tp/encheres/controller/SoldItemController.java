package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.service.SoldItemService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/solditems")
public class SoldItemController {

    private final SoldItemService soldItemService;

    public SoldItemController(SoldItemService soldItemService) {
        this.soldItemService = soldItemService;
    }

    @PostMapping
    public void createSell(@RequestBody SoldItem soldItem) {
        soldItemService.createSell(soldItem);
    }
}
