package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuctionRequestDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.AuctionResponseDto;
import fr.eni.tp.encheres.exception.AuctionException;
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
import java.util.List;
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
    public List<AuctionResponseDto> getSoldItemAuctions(UUID soldItemId) {
        return auctionMapper.toAuctionDtos(auctionRepository.findAllBySoldItemSoldItemIdOrderByAuctionPriceDesc(soldItemId));
    }

    @Override
    @Transactional
    public void createAuction(AuctionRequestDto requestAuction, AuthenticatedUserDto authenticatedUser) {
        SoldItem soldItem;

        try {
            soldItem = soldItemRepository.findById(UUID.fromString(requestAuction.getSoldItemId()))
                    .orElseThrow(() -> new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found"));
        } catch (IllegalArgumentException e) {
            throw new SoldItemException(HttpStatus.NOT_FOUND, "Sold item not found");
        }

        User currentBidder = userRepository.findByPseudo(authenticatedUser.getPseudo())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found"));

        Auction lastAuction = soldItem.getAuctions().stream().max(comparingInt(Auction::getAuctionPrice)).orElse(null);
        User seller = soldItem.getUser();

        auctionValidator.validateAuction(requestAuction, soldItem, currentBidder);

        // Last bidder get his money back
        if (lastAuction != null) {
            if (lastAuction.getUser().getUserId().equals(currentBidder.getUserId())) {
                throw new AuctionException(HttpStatus.BAD_REQUEST, "Can't bid sell");
            } else {
                lastAuction.getUser().setCredit(lastAuction.getUser().getCredit() + soldItem.getSellPrice());
                userRepository.save(lastAuction.getUser());

                seller.setCredit(seller.getCredit() + requestAuction.getAuctionPrice() - lastAuction.getAuctionPrice());
            }
        } else {
            seller.setCredit(seller.getCredit() + requestAuction.getAuctionPrice());
        }

        currentBidder.setCredit(currentBidder.getCredit() - requestAuction.getAuctionPrice());
        userRepository.save(currentBidder);

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
