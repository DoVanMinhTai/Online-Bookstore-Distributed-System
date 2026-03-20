package com.adc.product.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Table(name = "book")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder()
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String shortDescription;

    private String description;

    private String specification;

    private Long numPages;

    private boolean isPublished;

    private boolean isVisibleIndividually;

    private boolean isFeatured;

    private boolean isAllowedToOrder;

    private Date publishDate;

    private String slug;

    private String isbn13;

    private Long ratingsCount;

    private String title;

    private String titleWithoutSeries;

    private Double price;

    private Double availability;

    private String dimensions;

    private Float discountPercentage;

    private Double itemWeight;

    private String authorName;

    private Long thumbnailMediaId;

    private String size;

    private Long stockQuantity;

    private Double weight;

    private String metaTitle;

    private String metaKeyword;

    private String metaDescription;

    private String sku;

    @OneToMany(mappedBy = "book", cascade = CascadeType.PERSIST)
    private List<BookCate> bookCate;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "publisherId", referencedColumnName = "id")
    private BookPublisher publisher;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<BookRelated> bookRelated = new ArrayList<>();

    @OneToMany(mappedBy = "book")
    private List<BookImage> bookImages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "packageDimensions")
    private String packageDimensions;
}
