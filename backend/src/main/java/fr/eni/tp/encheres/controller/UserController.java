package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.RequestUserDto;
import fr.eni.tp.encheres.dto.ResponseUserDto;
import fr.eni.tp.encheres.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping("/{pseudo}")
    public ResponseEntity<ResponseUserDto> getUser(@PathVariable String pseudo) {
        return ResponseEntity.ok().body(userService.getUser(pseudo));
    }

    @PutMapping("/{pseudo}")
    public ResponseEntity<ResponseUserDto> updateUser(@PathVariable String pseudo, @Valid @RequestBody RequestUserDto user, Authentication authentication) {
        return ResponseEntity.ok().body(userService.updateUser(pseudo, user, (AuthenticatedUserDto) authentication.getPrincipal()));
    }

    @DeleteMapping("/{pseudo}")
    public ResponseEntity<String> deleteUser(@PathVariable String pseudo, Authentication authentication) {

        userService.deleteUser(pseudo, (AuthenticatedUserDto) authentication.getPrincipal());
        return ResponseEntity.ok().body("User deleted");
    }
}
