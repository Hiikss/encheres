package fr.eni.tp.encheres.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String pseudo;
    private String lastname;
    private String firstname;
    private String phoneNumber;
    private String street;
    private String postalCode;
    private String city;
    private String token;
    private int credit;
    private boolean admin;
}
