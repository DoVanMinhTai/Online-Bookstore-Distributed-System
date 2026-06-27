package com.adc.product.viewmodel;

import com.adc.product.model.Cate;

public record CategoryGetVm(
        Long id,
        String name,
        String description
) {
    public static CategoryGetVm fromModel(Cate cate) {
        return new CategoryGetVm(cate.getId(), cate.getName(), cate.getDescription());
    }
}
