package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Optional<Project> findByProjectId(Integer projectId);

    @Query("SELECT p, r FROM Project p LEFT JOIN FETCH p.requirements r WHERE p.owner.userId = :userId")
    List<Object[]> findEditableProjectsAndRequirementsByUserId(@Param("userId") Integer userId);

    @Query("SELECT p, r FROM Project p LEFT JOIN FETCH p.requirements r WHERE p.projectId NOT IN (SELECT pa.project.projectId FROM ProjectAssignment pa WHERE pa.user.userId = :userId)")
    List<Object[]> findUneditableProjectsAndRequirementsByUserId(@Param("userId") Integer userId);



}