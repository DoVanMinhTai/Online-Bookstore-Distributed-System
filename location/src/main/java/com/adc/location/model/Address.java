package com.adc.location.model;

import com.adc.location.model.enumeration.AddressType;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@Builder
@EqualsAndHashCode(exclude = {"id" , "addressType"})
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 450)
    private String contactName;

    @Column(length = 25)
    private String phone;

    @Column(length = 450, name = "address_line_1")
    private String addressLine1;

    @Column(length = 450, name = "address_line_2")
    private String addressLine2;

    @Column(length = 450)
    private String city;

    @Column(length = 25)
    private String zipCode;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne
    @JoinColumn(name = "state_or_province_id", nullable = false)
    private StateOrProvince stateOrProvince;

    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Enumerated(EnumType.STRING)
    @Column(name = "address_type",length = 20)
    private AddressType addressType;
}

