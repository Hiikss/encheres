package fr.eni.tp.encheres.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    private final UserService userService;

    private final AppProperties appProperties;

    public String createToken(AuthenticatedUserDto user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000);

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

        AuthenticatedUserDto user = userService.findByPseudo(decoded.getSubject());

        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
    }
}
