package fr.eni.tp.encheres.dto;

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
public class PartialUserRequestDto {

    @NotBlank(message = "Pseudo can't be blank")
    private String pseudo;

    @NotNull(message = "Active can't be null")
    private Boolean active;
}
