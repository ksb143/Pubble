package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.RequirementLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequirementLogRepository extends JpaRepository<RequirementLog, Integer> {

    List<RequirementLog> findAllByRequirement_requirementId(Integer requirementId);
    List<RequirementLog> findAllByUser_userId(Integer userId);
}
