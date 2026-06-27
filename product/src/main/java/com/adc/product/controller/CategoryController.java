package com.adc.product.controller;

import com.adc.product.service.CategoryService;
import com.adc.product.viewmodel.CategoryDetailGetVm;
import com.adc.product.viewmodel.CategoryGetVm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/storefront/categories")
    public ResponseEntity<List<CategoryGetVm>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    @GetMapping("/storefront/categories/{id}")
    public ResponseEntity<CategoryGetVm> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategory(id));
    }

    @GetMapping("/storefront/categories/{id}/books")
    public ResponseEntity<CategoryDetailGetVm> getBooksByCategory(
            @PathVariable Long id,
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "12", required = false) int pageSize
    ) {
        return ResponseEntity.ok(categoryService.getBooksByCategory(id, pageNo, pageSize));
    }
}
