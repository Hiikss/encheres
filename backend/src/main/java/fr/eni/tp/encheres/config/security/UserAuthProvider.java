package fr.eni.tp.encheres.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import fr.eni.tp.encheres.config.AppProperties;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.exception.JwtException;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.model.RefreshToken;
import fr.eni.tp.encheres.repository.RefreshTokenRepository;
import fr.eni.tp.encheres.repository.UserRepository;
import fr.eni.tp.encheres.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    private final UserService userService;

    private final UserRepository userRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final AppProperties appProperties;

    public String createToken(AuthenticatedUserDto user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + appProperties.getJwtTokenExpiration());

        return JWT.create()
                .withSubject(user.getPseudo())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(Algorithm.HMAC256(appProperties.getSecretKey()));
    }

    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(appProperties.getSecretKey());

        JWTVerifier verifier = JWT.require(algorithm).build();

        DecodedJWT decoded = verifier.verify(token);

        AuthenticatedUserDto user = userService.getAuthenticatedUser(decoded.getSubject());

        if (!user.isActive()) {
            throw new UserException(HttpStatus.FORBIDDEN, "Inactive user");
        }

        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
    }

    public RefreshToken createRefreshToken(AuthenticatedUserDto user) {
        Optional<RefreshToken> oRefreshToken = refreshTokenRepository.findByUserPseudo(user.getPseudo());

        oRefreshToken.ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(userRepository.findByPseudo(user.getPseudo()).orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "User not found")))
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(appProperties.getRefreshTokenExpiration()))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(String token, AuthenticatedUserDto user) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new JwtException(HttpStatus.NOT_FOUND, "Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new JwtException(HttpStatus.UNAUTHORIZED, "Refresh token is expired");
        }
        if (refreshToken.getUser().getPseudo().equals(user.getPseudo())) {
            refreshTokenRepository.delete(refreshToken);
            return createRefreshToken(user);
        }
        throw new JwtException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
    }
}
