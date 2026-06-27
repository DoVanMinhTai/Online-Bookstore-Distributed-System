package com.adc.product.controller;


import com.adc.product.config.SearchIndexInitializer;
import com.adc.product.model.Book;
import com.adc.product.model.PaginatedItems;
import com.adc.product.service.ProductService;
import com.adc.product.viewmodel.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class BookController {
    private ProductService productService;
    private final SearchIndexInitializer searchIndexInitializer;

    public BookController(ProductService productService, SearchIndexInitializer searchIndexInitializer) {
        this.productService = productService;
        this.searchIndexInitializer = searchIndexInitializer;
    }

    @PostMapping("/storefront/product/reindex")
    public ResponseEntity<String> reindex() throws InterruptedException {
        searchIndexInitializer.reindex();
        return ResponseEntity.ok("Reindex completed");
    }



    @GetMapping("/storefront/product/getBooks")
    public ResponseEntity<PaginatedItems<Book>> getBooks(
            @RequestParam(defaultValue = "0") int pageIndex
            , @RequestParam(defaultValue = "10") int pageSize
    ) {
        PaginatedItems<Book> paginaredBooks = productService.getBooks(pageIndex, pageSize);
        return ResponseEntity.ok(paginaredBooks);
    }

    @GetMapping("/storefront/product/search")
    public ResponseEntity<PaginatedItems<Book>> search(@RequestParam(defaultValue = "word") String word, @RequestParam(defaultValue = "0") int pageIndex, @RequestParam(defaultValue = "10") int pageSize) {
        PaginatedItems<Book> paginatedItems = productService.searchBooksByWord(word, pageIndex, pageSize);
        return ResponseEntity.ok(paginatedItems);
    }

    @GetMapping("/storefront/products/books")
    public ResponseEntity<BookListGetVM> listBooks(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
            @RequestParam(value = "book-name", defaultValue = "", required = false) String bookName,
            @RequestParam(value = "brand-name", defaultValue = "", required = false) String brandName
    ) {
        return ResponseEntity.ok(productService.getBooksWithFilter(pageNo, pageSize, bookName, brandName));
    }

    @GetMapping("/storefront/products/brand")
    public ResponseEntity<List<Book>> getBookBrand(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "5", required = false) int pageSize,
            @RequestParam(value = "brand-name", defaultValue = "", required = false) String brandName
    ) {
        return ResponseEntity.ok(productService.getBooksByBrand(brandName));
    }

    @GetMapping("/storefront/products")
    public ResponseEntity<ProductGetCheckoutListVm> getProductCheckoutList(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "20", required = false) int pageSize,
            @RequestParam(value = "ids", required = false) List<Long> productIds) {
        return ResponseEntity.ok(productService.getProductCheckoutList(pageNo, pageSize, productIds));
    }

    @GetMapping("/storefront/products/productsBestSelling")
    public ResponseEntity<List<ProductThumbnailGetVm>> getProductBestSelling() {
        return ResponseEntity.ok(productService.getProductBestSelling());
    }

    @GetMapping("/storefront/products/productFeatured")
    public ResponseEntity<ProductFeaturedGetVm> getProductFeatured(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService.getFeaturedProduct(pageNo, pageSize));
    }

    @GetMapping("/storefront/product/slug/{slug}")
    public ResponseEntity<ProductDetailGetVm> getProductDetail(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(productService.getProductDetail(slug));
    }

    @GetMapping("/storefront/product/listProduct")
    public ResponseEntity<List<ProductThumbnailGetVm>> getProductById(@RequestParam List<Long> productIds) {
        return ResponseEntity.ok(productService.getProductByIds(productIds));
    }

    @GetMapping("/storefront/product/{id}")
    public ResponseEntity<ProductThumbnailGetVm> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/storefront/product/productSimilar/{slug}")
    public ResponseEntity<List<ProductThumbnailGetVm>> getProductSimilar(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductSimilarBySlug(slug));
    }

    @GetMapping("/storefront/product/checkExistsByProductId")
    public ResponseEntity<Boolean> checkProductExists(@RequestParam Long productId) {
        return ResponseEntity.ok(productService.checkProductExists(productId));
    }
}
