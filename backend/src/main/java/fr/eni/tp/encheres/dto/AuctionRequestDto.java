package fr.eni.tp.encheres.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuctionRequestDto {

    @NotNull(message = "auction price can't be null")
    @Min(value = 1, message = "The start price must be greater than O")
    private Integer auctionPrice;

    @NotBlank(message = "UUID can't be blank")
    private String soldItemId;
}
