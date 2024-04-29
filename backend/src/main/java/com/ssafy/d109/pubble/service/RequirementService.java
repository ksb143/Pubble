package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.ProgressRatio;
import com.ssafy.d109.pubble.dto.RequirementCreateDto;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.repository.ProjectRepository;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RequirementService {

    private final RequirementRepository requirementRepository;
    private final ProjectRepository projectRepository;

    public float getApprovalRatio(Integer projectId) {

        float approvalRatio;

        int approved = 0;
        int unapproved = 0;

        List<Requirement> requirements = requirementRepository.findLatestRequirementsForProjectByProjectId(projectId);

        for(Requirement requirement : requirements) {
            if (requirement.getApproval().equals("a")) {
                approved += 1;
            } else {
                unapproved += 1;
            }
        }
        if (unapproved == 0) {
            if (approved == 0) {
                approvalRatio = 0;
            } else {
                approvalRatio = 1;
            }
        } else {
            approvalRatio = (float) approved / unapproved;
        }
        return approvalRatio;
    }

    public ProgressRatio getProgressRatio(Integer projectId) {
        float lockRatio;
        float approvalRatio;
        float changeRatio;

        int locked = 0;
        int unlocked = 0;

        int approved = 0;
        int unapproved = 0;

        int unchanged = 0;
        int changed = 0;

        List<Requirement> requirements = requirementRepository.findLatestRequirementsForProjectByProjectId(projectId);

        for(Requirement requirement : requirements) {
            if (requirement.getIsLock().equals("l")) {
                locked += 1;
            } else {
                unlocked += 1;
            }

            if (requirement.getApproval().equals("a")) {
                approved += 1;
            } else {
                unapproved += 1;
            }

            if (requirement.getLatest_version().equals("V.1.0.")) {
                unchanged += 1;
            } else {
                changed += 1;
            }
        }

        if (unlocked == 0) {
            if (locked == 0) {
                lockRatio = 0;
            } else {
                lockRatio = 1;
            }
        } else {
            lockRatio = (float) locked / unlocked;
        }

        if (unapproved == 0) {
            if (approved == 0) {
                approvalRatio = 0;
            } else {
                approvalRatio = 1;
            }
        } else {
            approvalRatio = (float) approved / unapproved;
        }

        if (unchanged == 0) {
            if (changed == 0) {
                changeRatio = 0;
            } else {
                changeRatio = 1;
            }
        } else {
            changeRatio = (float) changed / unchanged;
        }

        return ProgressRatio.builder().lockRatio(lockRatio).approvalRatio(approvalRatio).changeRatio(changeRatio).build();
    }

    // requirement 생성
    public void createRequirement(Integer projectId, RequirementCreateDto requirementCreateDto) {
        System.out.println("RequirementService.createRequirement");
        Optional<Project> projectOptional = projectRepository.findByProjectId(projectId);

        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();
            System.out.println("project.toString() = " + project.toString());

            // orderIndex
            Integer orderIndex = requirementRepository.findMaxOrderIndexByProjectId(project.getProjectId());
            if (orderIndex == null) {
                orderIndex = 0; // 해당 프로젝트에 요구사항이 없다면 0으로 시작
            } else {
                orderIndex += 1;
            }
            System.out.println("orderIndex = " + orderIndex);

            requirementRepository.save(Requirement.builder().isLock("u").approval("u").code(requirementCreateDto.getCode()).requirementName(requirementCreateDto.getRequirementName()).detail(requirementCreateDto.getDetail()).manager(requirementCreateDto.getManager()).author(requirementCreateDto.getAuthor()).targetUser(requirementCreateDto.getTargetUser()).latest_version("V.1.0.").orderIndex(orderIndex).project(project).build());
        }
    }

    public void updateRequirementLock() {

    }

    public void updateRequirementApproval() {

    }


    // requirement 조회

    // requirement 수정-버전
}
