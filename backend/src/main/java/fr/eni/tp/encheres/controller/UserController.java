package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.config.security.UserAuthProvider;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.UserDto;
import fr.eni.tp.encheres.model.User;
import fr.eni.tp.encheres.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok().body(userService.getUser(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<AuthenticatedUserDto> updateUser(@PathVariable UUID userId, @Valid @RequestBody SignUpDto user, Authentication authentication) {
        return ResponseEntity.ok().body(userService.updateUser(userId, user, (AuthenticatedUserDto) authentication.getPrincipal()));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId, Authentication authentication) {

        userService.deleteUser(userId, (AuthenticatedUserDto) authentication.getPrincipal());
        return ResponseEntity.ok().body("User deleted");
    }
}
