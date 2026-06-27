package com.adc.product.respository;

import com.adc.product.model.BookCate;
import com.adc.product.model.Cate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookCategoryRepository extends JpaRepository<Cate, Long> {

    List<Cate> findAllByActiveTrueOrderByNameAsc();
}


