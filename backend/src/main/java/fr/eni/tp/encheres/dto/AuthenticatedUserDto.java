package fr.eni.tp.encheres.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserDto {

    private UUID id;
    private String pseudo;
    private String lastname;
    private String firstname;
    private String email;
    private String phoneNumber;
    private String street;
    private String postalCode;
    private String city;
    private int credit;
    private boolean admin;
    private String token;
}
