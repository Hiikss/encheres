package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuctionDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.exception.SoldItemException;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.mapper.AuctionMapper;
import fr.eni.tp.encheres.model.Auction;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.model.User;
import fr.eni.tp.encheres.repository.AuctionRepository;
import fr.eni.tp.encheres.repository.SoldItemRepository;
import fr.eni.tp.encheres.repository.UserRepository;
import fr.eni.tp.encheres.validation.AuctionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static java.util.Comparator.comparingInt;

@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {

    private final AuctionRepository auctionRepository;

    private final SoldItemRepository soldItemRepository;

    private final UserRepository userRepository;

    private final AuctionMapper auctionMapper;

    private final AuctionValidator auctionValidator;

    @Override
    @Transactional
    public void createAuction(AuctionDto requestAuction, AuthenticatedUserDto authenticatedUser) {
        SoldItem soldItem;

        try {
            soldItem = soldItemRepository.findById(UUID.fromString(requestAuction.getSoldItemId()))
                    .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));
        } catch (IllegalArgumentException e) {
            throw new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found");
        }

        User currentBidder = userRepository.findByPseudo(authenticatedUser.getPseudo())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found"));

        User lastBidder = soldItem.getAuctions().stream().max(comparingInt(Auction::getAuctionPrice)).map(Auction::getUser).orElse(null);
        User seller = soldItem.getUser();

        auctionValidator.validateAuction(requestAuction, soldItem, currentBidder);

        // Last bidder get his money back
        if (lastBidder != null) {
            if (lastBidder.getUserId().equals(currentBidder.getUserId())) {
                currentBidder.setCredit(currentBidder.getCredit() + soldItem.getSellPrice());
            } else {
                lastBidder.setCredit(lastBidder.getCredit() + soldItem.getSellPrice());
                userRepository.save(lastBidder);
            }
        }

        currentBidder.setCredit(currentBidder.getCredit() - requestAuction.getAuctionPrice());
        userRepository.save(currentBidder);
        
        seller.setCredit(seller.getCredit() + requestAuction.getAuctionPrice());
        userRepository.save(seller);

        soldItem.setSellPrice(requestAuction.getAuctionPrice());
        soldItemRepository.save(soldItem);

        Auction auction = auctionMapper.toAuction(requestAuction);
        auction.setAuctionDate(LocalDate.now());
        auction.setSoldItem(soldItem);
        auction.setUser(currentBidder);
        auctionRepository.save(auction);
    }
}
