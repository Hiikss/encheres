package fr.eni.tp.encheres.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SoldItemRequestDto {

    @NotBlank(message = "Item name can't be null")
    private String itemName;

    @NotBlank(message = "Description name can't be null")
    private String description;

    @NotBlank(message = "Image can't be null")
    private String imageUrl;

    @NotNull
    private LocalDate auctionStartDate;

    @NotNull
    private LocalDate auctionEndDate;

    @NotNull(message = "Start price can't be null")
    @Min(value = 1, message = "The start price must be greater than O")
    private Integer startPrice;

    @NotNull(message = "Sell price can't be null")
    @Min(value = 1, message = "The sell price must be greater than O")
    private Integer sellPrice;

    @NotBlank(message = "Street can't be blank")
    private String pickUpStreet;

    @Pattern(regexp = "\\d{5}", message = "Postal code must be 5 digits length")
    private String pickUpPostalCode;

    @NotBlank(message = "City can't be blank")
    private String pickUpCity;

    @NotNull(message = "PickUpDone can't be null")
    private Boolean pickUpDone;

    @NotBlank(message = "Category can't be blank")
    private String categoryLabel;
}
