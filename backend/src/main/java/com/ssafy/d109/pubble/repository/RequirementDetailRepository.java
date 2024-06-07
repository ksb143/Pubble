package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.RequirementDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RequirementDetailRepository extends JpaRepository<RequirementDetail, Integer> {

    RequirementDetail findByRequirementDetailId(Integer requirementDetailId);

    List<RequirementDetail> findAllByRequirement_requirementId(Integer requirementId);
}
