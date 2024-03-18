package fr.eni.tp.encheres.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestUserDto {

    @NotBlank(message = "Pseudo can't be blank")
    @Pattern(regexp = "^[a-zA-Z0-9]{4,}$", message = "Pseudo must contains only alphanumeric characters")
    private String pseudo;

    @NotBlank(message = "Lastname can't be blank")
    private String lastname;

    @NotBlank(message = "Firstname can't be blank")
    private String firstname;

    @NotBlank(message = "Email can't be blank")
    @Email(message = "Must be an email")
    private String email;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits length")
    private String phoneNumber;

    @NotBlank(message = "Street can't be blank")
    private String street;

    @Pattern(regexp = "\\d{5}", message = "Postal code must be 5 digits length")
    private String postalCode;

    @NotBlank(message = "City can't be blank")
    private String city;

    private char[] password;

    @NotNull(message = "Credit can't be null")
    @Min(value = 0, message = "Credit must be equal to or greater than 0")
    private Integer credit;

    @NotNull(message = "Active can't be null")
    private Boolean active;

}
