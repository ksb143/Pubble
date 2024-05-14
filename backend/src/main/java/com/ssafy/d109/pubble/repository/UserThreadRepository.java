package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.UserThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserThreadRepository extends JpaRepository<UserThread, Integer> {

    List<UserThread> findAllByUser_userId(Integer userId);
//    List<UserThread> findAllByRequirement_requirementId(Integer requirementId);
    List<UserThread> findAllByRequirementDetail_RequirementDetailId(Integer detailId);
    Optional<UserThread> findUserThreadByUserThreadId(Integer userThreadId);
}
