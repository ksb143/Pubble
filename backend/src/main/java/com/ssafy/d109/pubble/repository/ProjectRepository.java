package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Optional<Project> findByProjectId(Integer projectId);

}