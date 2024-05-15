package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Integer> {
    List<ProjectAssignment> findAllByUser_userId(Integer userId);
    List<ProjectAssignment> findAllByProject_projectId(Integer projectId);


    @Query("SELECT pa.project FROM ProjectAssignment pa WHERE pa.user.userId = :userId")
    List<Project> findAllProjectsByUserId(Integer userId);

    @Query("SELECT u.name FROM ProjectAssignment pa JOIN pa.user u WHERE pa.project.projectId = :projectId")
    List<String> findUsernamesByProjectId(Integer projectId);

    @Query("SELECT pa.user FROM ProjectAssignment pa WHERE pa.project.projectId = :projectId")
    List<User> findUsersByProjectId(Integer projectId);
}
