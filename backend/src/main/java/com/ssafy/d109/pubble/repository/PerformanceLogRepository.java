package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.PerformanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceLogRepository extends JpaRepository<PerformanceLog, Integer> {

    List<PerformanceLog> findAllByUser_userId(Integer userId);
}
