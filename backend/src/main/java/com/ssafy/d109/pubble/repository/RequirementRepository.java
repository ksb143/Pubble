package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RequirementRepository extends JpaRepository<Requirement, Integer> {

    List<Requirement> findAllByProject_projectId(Integer projectId);

    Optional<Requirement> findByRequirementId(Integer requirementId);

    List<Requirement> findByProject_ProjectIdAndCode(Integer projectId, String code);

    //    - projectId를 인자로 받는다.
    //    - projectId에 해당하는 requirement들을 찾는다.
    //    - 해당하는 requirement들 중 code 값이 같은 requirement가 여러 개 있다면, 가장 최신의 것만 고른다.
    @Query("SELECT r FROM Requirement r " +
            "WHERE r.project.projectId = :projectId " +
            "AND r.createdAt = (SELECT MAX(r2.createdAt) FROM Requirement r2 " +
            "                   WHERE r2.code = r.code AND r2.project.projectId = :projectId) " +
            "ORDER BY r.orderIndex")
    List<Requirement> findLatestRequirementsForProjectByProjectId(Integer projectId);

    // 해당 프로젝트의 최대 orderindex
    @Query("SELECT MAX(r.orderIndex) FROM Requirement r WHERE r.project.projectId = :projectId")
    Integer findMaxOrderIndexByProjectId(Integer projectId);

    // approval만 뽑아옴
    @Query("SELECT r.approval FROM Requirement r WHERE r.project.projectId = :projectId")
    List<String> findApprovalByProjectId(Integer projectId);

//    // lock, approval 뽑아옴
//    @Query("SELECT r.lock, r.approval FROM Requirement r WHERE r.project.projectId = :projectId")
//    List<?> findLockApprovalByProjectId(Integer projectId);

    Optional<Requirement> findRequirementByRequirementId(Integer requirementId);

}
