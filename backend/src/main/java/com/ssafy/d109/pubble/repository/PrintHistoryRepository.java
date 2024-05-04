package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.PrintHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrintHistoryRepository extends JpaRepository<PrintHistory, Integer> {

    List<PrintHistory> findAllByUser_userId(Integer userId);
}
