package com.adc.product.respository;

import com.adc.product.model.Book;
import com.adc.product.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query(value = "SELECT * FROM book WHERE title LIKE %:word% OR author_name LIKE %:word%", nativeQuery = true)
    Page<Book> searchBookByWord(@Param("word") String word, Pageable pageable);

    @Query(value = "SELECT b FROM Book b WHERE LOWER(b.name) LIKE %:bookName% "
            + "AND (b.brand.name IN :brandName OR (:brandName is null OR :brandName = '')) " +
            "AND b.isPublished = TRUE " +
            "AND b.isVisibleIndividually = TRUE " +
            "ORDER BY b.id ASC ")
    Page<Book> getBooksWithFilter(@Param("bookName")String bookName,@Param("brandName") String brandName, Pageable pageable);

    List<Book> findAllByBrandAndIsPublishedTrueOrderByIdDesc(Brand brand);

    Optional<Book> findBySlugAndIsPublishedTrue(String slug);

    @Query("SELECT p FROM Book p WHERE p.id IN :productIds AND p.isPublished = TRUE")
    Page<Book> findAllPublishedProductsByIds(@Param("productIds") List<Long> productIds, Pageable pageable);

    @Query("SELECT p FROM Book p WHERE p.id IN :productIds AND p.isPublished = TRUE")
    List<Book> findAllPublishedProductsByIds(@Param("productIds") List<Long> productIds);

    @Query("FROM Book b where b.isPublished = TRUE AND b.isFeatured = TRUE AND b.isVisibleIndividually = TRUE" +
            " ORDER BY b.id asc ")
    Page<Book> getFeaturedProducts(Pageable pageable);

    List<Book> findAllByIdAndBrand_Id(Long id, Long brandId);

    @Query("SELECT b FROM Book b JOIN b.bookCate bc WHERE bc.cate.id = :categoryId "
            + "AND b.isPublished = TRUE "
            + "AND b.isVisibleIndividually = TRUE "
            + "ORDER BY b.id DESC")
    Page<Book> findAllByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
}



