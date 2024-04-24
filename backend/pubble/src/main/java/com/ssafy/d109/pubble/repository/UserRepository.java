package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    
}
