package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Boolean existsByEmployeeId(String employeeId);
    Optional<User> findByEmployeeId(String employeeId);

}
