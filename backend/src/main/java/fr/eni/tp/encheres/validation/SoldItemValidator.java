package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.dto.RequestSoldItemDto;

public interface SoldItemValidator {

    void validateSoldItem(RequestSoldItemDto soldItem);
}
