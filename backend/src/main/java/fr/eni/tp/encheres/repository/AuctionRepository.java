package fr.eni.tp.encheres.repository;

import fr.eni.tp.encheres.model.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, UUID> {

    List<Auction> findAllBySoldItemSoldItemIdOrderByAuctionPriceDesc(UUID soldItemId);
}
