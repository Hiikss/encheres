package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.SoldItemRequestDto;

public interface SoldItemValidator {

    void validateSoldItem(SoldItemRequestDto soldItem);
}
