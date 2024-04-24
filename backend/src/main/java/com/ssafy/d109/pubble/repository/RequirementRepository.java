package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequirementRepository extends JpaRepository<Requirement, Integer> {

    List<Requirement> findAllByUser_userId(Integer userId);
    List<Requirement> findAllByProject_projectId(Integer projectId);
}
