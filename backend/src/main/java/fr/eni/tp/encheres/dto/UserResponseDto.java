package fr.eni.tp.encheres.dto;

public record UserResponseDto(String pseudo, String lastname, String firstname, String email, String phoneNumber, String street, String postalCode, String city, int credit, boolean active) {
}
