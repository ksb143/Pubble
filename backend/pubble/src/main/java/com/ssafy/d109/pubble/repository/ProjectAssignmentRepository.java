package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Integer> {

    List<ProjectAssignment> findAllByUser_userId(Integer userId);
    List<ProjectAssignment> findAllByProject_projectId(Integer projectId);
}
