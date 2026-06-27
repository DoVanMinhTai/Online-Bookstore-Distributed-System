package com.adc.product.viewmodel;

import java.util.List;

public record CategoryDetailGetVm(
        Long id,
        String name,
        String description,
        List<ProductThumbnailGetVm> books,
        int pageNo,
        int pageSize,
        int totalElements,
        int totalPages,
        boolean isLast
) {
}
