package com.adc.product.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "brand")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Brand  extends AbstractAuditEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String slug;

    private boolean isPublished;

    @OneToMany(mappedBy = "brand")
    private List<Book> books;




}
