package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.SoldItemDto;

public interface SoldItemValidator {

    void validateSoldItem(SoldItemDto soldItem);
}
