package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.PartialUserRequestDto;
import fr.eni.tp.encheres.dto.UserRequestDto;
import fr.eni.tp.encheres.dto.UserResponseDto;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getUsers(@RequestParam(defaultValue = "1") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          @RequestParam(defaultValue = "") String searchFilter,
                                                          Authentication authentication) {
        if (!((AuthenticatedUserDto) authentication.getPrincipal()).isAdmin()) {
            throw new UserException(HttpStatus.FORBIDDEN, "Can't get users");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", Long.toString(userService.countUsers(searchFilter)));
        headers.setAccessControlExposeHeaders(List.of("X-Total-Count"));
        return ResponseEntity.ok().headers(headers).body(userService.getUsers(page, size, searchFilter));
    }

    @GetMapping("/{pseudo}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable String pseudo) {
        return ResponseEntity.ok().body(userService.getUserResponse(pseudo));
    }

    @PutMapping("/{pseudo}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable String pseudo, @Valid @RequestBody UserRequestDto user, Authentication authentication) {
        return ResponseEntity.ok().body(userService.updateUser(pseudo, user, (AuthenticatedUserDto) authentication.getPrincipal()));
    }

    @DeleteMapping("/{pseudo}")
    public ResponseEntity<String> deleteUser(@PathVariable String pseudo, Authentication authentication) {

        userService.deleteUser(pseudo, (AuthenticatedUserDto) authentication.getPrincipal());
        return ResponseEntity.ok().body("User deleted");
    }

    @PatchMapping
    @ResponseStatus(HttpStatus.OK)
    public void updatePartiallyUser(@RequestBody PartialUserRequestDto partialUser) {

        userService.partialUpdateUser(partialUser);
    }
}
