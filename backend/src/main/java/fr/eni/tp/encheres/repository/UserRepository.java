package fr.eni.tp.encheres.repository;

import fr.eni.tp.encheres.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u " +
            "WHERE :searchFilter = '' OR u.pseudo LIKE '%' || :searchFilter || '%' " +
            "OR u.email LIKE '%' || :searchFilter || '%'" +
            "ORDER BY u.pseudo")
    List<User> findUsersByFilters(Pageable pageable, String searchFilter);

    @Query("SELECT COUNT(u) FROM User u " +
            "WHERE :searchFilter = '' OR u.pseudo LIKE '%' || :searchFilter || '%' " +
            "OR u.email LIKE '%' || :searchFilter || '%'")
    long countUserByFilters(String searchFilter);

    @Query("SELECT u FROM User u WHERE :login = u.pseudo OR :login = u.email")
    Optional<User> findByLogin(String login);

    Optional<User> findByPseudo(String pseudo);

    Optional<User> findByEmail(String email);

    void deleteByPseudo(String pseudo);

}
