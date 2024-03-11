package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.AuctionDto;
import fr.eni.tp.encheres.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auctions")
@RequiredArgsConstructor
@Validated
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping
    public void createAuction(@Valid @RequestBody AuctionDto requestAuction, Authentication authentication) {
        auctionService.createAuction(requestAuction, (AuthenticatedUserDto) authentication.getPrincipal());
    }
}
