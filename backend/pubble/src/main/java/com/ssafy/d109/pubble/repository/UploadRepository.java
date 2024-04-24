package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.Upload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadRepository extends JpaRepository<Upload, Integer> {

    List<Upload> findAllByUser_userId(Integer userId);
    List<Upload> findAllByRequirement_requirementId(Integer requirementId);
}
