package com.example.customer.respository;

import com.example.customer.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRespository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findAllByUserId(String userID);


    Optional<UserAddress> findByUserIdAndIsActiveTrue(String userID);

    boolean existsByUserId(String userId);

    @Modifying
    @Query("UPDATE UserAddress ua SET ua.isActive = :isActive WHERE us.userId = :userId")
    void updateIsActiveByUserId(String userId, boolean isActive);
}
