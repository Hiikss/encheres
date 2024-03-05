package fr.eni.tp.encheres.dto;

public record SignUpDto(String pseudo, String lastname, String firstName, String phoneNumber, String street, String postalCode, String city, char[] password) {
}
