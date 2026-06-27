package com.adc.product.service;

import com.adc.commonlibrary.exception.NotFoundException;
import com.adc.product.model.Book;
import com.adc.product.model.Cate;
import com.adc.product.respository.BookCategoryRepository;
import com.adc.product.respository.BookRepository;
import com.adc.product.viewmodel.CategoryDetailGetVm;
import com.adc.product.viewmodel.CategoryGetVm;
import com.adc.product.viewmodel.ProductThumbnailGetVm;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {
    private final BookCategoryRepository bookCategoryRepository;
    private final BookRepository bookRepository;
    private final MediaService mediaService;

    public List<CategoryGetVm> getCategories() {
        return bookCategoryRepository.findAllByActiveTrueOrderByNameAsc()
                .stream()
                .map(CategoryGetVm::fromModel)
                .toList();
    }

    public CategoryGetVm getCategory(Long id) {
        Cate cate = bookCategoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found", String.valueOf(id)));
        return CategoryGetVm.fromModel(cate);
    }

    public CategoryDetailGetVm getBooksByCategory(Long id, int pageNo, int pageSize) {
        Cate cate = bookCategoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found", String.valueOf(id)));

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Book> bookPage = bookRepository.findAllByCategoryId(id, pageable);

        List<ProductThumbnailGetVm> books = bookPage.getContent()
                .stream()
                .map(book -> new ProductThumbnailGetVm(
                        book.getId(),
                        book.getName(),
                        book.getSlug(),
                        getThumbnailUrl(book.getThumbnailMediaId()),
                        book.getPrice()
                ))
                .toList();

        return new CategoryDetailGetVm(
                cate.getId(),
                cate.getName(),
                cate.getDescription(),
                books,
                bookPage.getNumber(),
                bookPage.getSize(),
                (int) bookPage.getTotalElements(),
                bookPage.getTotalPages(),
                bookPage.isLast()
        );
    }

    private String getThumbnailUrl(Long mediaId) {
        if (mediaId == null) {
            return null;
        }
        return mediaService.getMedia(mediaId).url();
    }
}
