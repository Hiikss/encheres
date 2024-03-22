package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.*;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.mapper.UserMapper;
import fr.eni.tp.encheres.model.Auction;
import fr.eni.tp.encheres.model.SoldItem;
import fr.eni.tp.encheres.model.User;
import fr.eni.tp.encheres.repository.AuctionRepository;
import fr.eni.tp.encheres.repository.SoldItemRepository;
import fr.eni.tp.encheres.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.CharBuffer;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static java.util.Comparator.comparingInt;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
    private static final String USER_NOT_FOUND = "User not found";

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    private final AuctionRepository auctionRepository;
    private final SoldItemRepository soldItemRepository;

    @Override
    public AuthenticatedUserDto login(CredentialsDto credentialsDto) {
        LOGGER.info("[Service] : attempting to login");

        User user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "Bad credentials"));

        if (user.isActive() && passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toAuthenticatedUserDto(user);
        }

        throw new UserException(HttpStatus.BAD_REQUEST, "Bad credentials");
    }

    @Override
    public AuthenticatedUserDto register(UserRequestDto userRequestDto) {
        Optional<User> oUser = userRepository.findByPseudo(userRequestDto.getPseudo());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo already exists");
        }

        oUser = userRepository.findByEmail(userRequestDto.getEmail());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = userMapper.toUser(userRequestDto);

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userRequestDto.getPassword())));
        user.setCredit(100);
        user.setAdmin(false);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        return userMapper.toAuthenticatedUserDto(savedUser);
    }

    @Override
    public AuthenticatedUserDto getAuthenticatedUser(String userPseudo) {
        User user = userRepository.findByPseudo(userPseudo)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
        return userMapper.toAuthenticatedUserDto(user);
    }

    @Override
    public List<UserResponseDto> getUsers(int page, int size, String searchFilter) {
        Pageable pageable = PageRequest.of(page - 1, Math.min(size, 100));
        List<User> users = userRepository.findUsersByFilters(pageable, searchFilter);
        return userMapper.toResponseUserDtoList(users);
    }

    @Override
    public long countUsers(String searchFilter) {
        return userRepository.countUserByFilters(searchFilter);
    }

    @Override
    public UserResponseDto getUserResponse(String pseudo) {
        User user = userRepository.findByPseudo(pseudo)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    @Override
    public UserResponseDto updateUser(String pseudo, UserRequestDto userDto, AuthenticatedUserDto authenticatedUser) {
        if (authenticatedUser.getPseudo().equals(pseudo) || authenticatedUser.isAdmin()) {
            User userToUpdate = userRepository.findByPseudo(pseudo)
                    .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));

            if (!userToUpdate.getPseudo().equals(userDto.getPseudo())) {
                throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo can't be changed");
            }

            Optional<User> oUser = userRepository.findByEmail(userDto.getEmail());

            if (oUser.isPresent() && !oUser.get().getPseudo().equals(userToUpdate.getPseudo())) {
                throw new UserException(HttpStatus.BAD_REQUEST, "Email already exists");
            }

            User updatedUser = userMapper.toUser(userDto);
            updatedUser.setUserId(userToUpdate.getUserId());
            updatedUser.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

            User savedUser = userRepository.save(updatedUser);

            return userMapper.toUserDto(savedUser);
        }

        throw new UserException(HttpStatus.FORBIDDEN, "Can't update this user");
    }

    @Override
    @Transactional
    public void deleteUser(String pseudo, AuthenticatedUserDto authenticatedUser) {
        if (authenticatedUser.isAdmin() || authenticatedUser.getPseudo().equals(pseudo)) {
            User user = userRepository.findByPseudo(pseudo)
                    .orElseThrow(() -> new UserException(HttpStatus.FORBIDDEN, "Can't delete this user"));

            // SoldItems
            // Pour tous les solditems en cours, rendre l'argent au dernier enchérisseur s'il y en a un
//            deleteUserSoldItems(user);

            // Auctions
            // Pour toutes les auctions relatives à des solditems en cours, si l'auction est la dernière reprendre l'argent au vendeur
//            deleteUserAuctions(user);

            userRepository.deleteByPseudo(pseudo);
            return;
        }

        throw new UserException(HttpStatus.FORBIDDEN, "Can't delete this user");
    }

    @Override
    public void partialUpdateUser(PartialUserRequestDto partialUser) {
        User user = userRepository.findByPseudo(partialUser.getPseudo())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));

//        deleteUserSoldItems(user);

//        deleteUserAuctions(user);
        user.setActive(partialUser.getActive());
        userRepository.save(user);
    }

    private void deleteUserSoldItems(User user) {
        List<SoldItem> soldItems = user.getSoldItems();
        for (SoldItem soldItem : soldItems) {
            if ((soldItem.getAuctionStartDate().isBefore(LocalDate.now()) || soldItem.getAuctionStartDate().isEqual(LocalDate.now())) && soldItem.getAuctionEndDate().isAfter(LocalDate.now())) {
                Auction lastAuction = soldItem.getAuctions().stream().max(comparingInt(Auction::getAuctionPrice)).orElse(null);
                if (lastAuction != null) {
                    User lastBidder = lastAuction.getUser();
                    lastBidder.setCredit(lastBidder.getCredit() + lastAuction.getAuctionPrice());
                    userRepository.save(lastBidder);
                }
            }
            soldItemRepository.deleteById(soldItem.getSoldItemId());
        }
    }

    private void deleteUserAuctions(User user) {
        List<Auction> auctions = user.getAuctions();
        for (Auction auction : auctions) {
            if (auction.getSoldItem().getAuctionEndDate().isAfter(LocalDate.now())) {
                List<Auction> soldItemsAuctions = auction.getSoldItem().getAuctions().stream()
                        .sorted(Comparator.comparingInt(Auction::getAuctionPrice).reversed())
                        .toList();
                Auction lastAuction = soldItemsAuctions.get(0); // soldItemAuctions est forcément non vide car on a récupéré ces auctions à partir du solditem de l'auction
                if (lastAuction.getUser().getUserId() == user.getUserId()) {
                    SoldItem soldItem = auction.getSoldItem();
                    if (soldItemsAuctions.size() > 1) {
                        soldItem.setSellPrice(soldItemsAuctions.get(1).getAuctionPrice());
                        // TODO
                    } else {
                        soldItem.setSellPrice(soldItem.getStartPrice());
                        // TODO
                    }
                    soldItemRepository.save(soldItem);
                }
            }
            auctionRepository.deleteById(auction.getAuctionId());
        }
    }
}
