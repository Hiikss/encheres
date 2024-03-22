package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.AuctionRequestDto;
import fr.eni.tp.encheres.dto.AuctionResponseDto;
import fr.eni.tp.encheres.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/auctions")
@RequiredArgsConstructor
@Validated
public class AuctionController {

    private final AuctionService auctionService;

    @GetMapping
    public ResponseEntity<List<AuctionResponseDto>> getSoldItemAuctions(@RequestParam UUID soldItemId)  {
        return ResponseEntity.ok().body(auctionService.getSoldItemAuctions(soldItemId));
    }

    @PostMapping
    public void createAuction(@Valid @RequestBody AuctionRequestDto requestAuction, Authentication authentication) {
        auctionService.createAuction(requestAuction, (AuthenticatedUserDto) authentication.getPrincipal());
    }
}
