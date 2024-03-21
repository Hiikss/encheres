package fr.eni.tp.encheres.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestRefreshTokenDto {

    @NotBlank
    private String token;

    @NotBlank
    private String pseudo;
}
