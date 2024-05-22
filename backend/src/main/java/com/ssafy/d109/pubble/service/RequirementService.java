package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.projectDto.*;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.entity.*;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.RequirementDetail;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.Requirement.RequirementNotFoundException;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.exception.notification.NotificationNotFoundException;
import com.ssafy.d109.pubble.exception.notification.NotificationSendingFailedException;
import com.ssafy.d109.pubble.repository.*;
import com.ssafy.d109.pubble.exception.UserThread.UnauthorizedAccessException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class RequirementService {

    private final RequirementRepository requirementRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final UserRepository userRepository;
    private final RequirementDetailRepository detailRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    public float getApprovalRatio(Integer projectId) {

        float approvalRatio;

        int approved = 0;
        int unapproved = 0;

        List<Requirement> requirements = requirementRepository.findLatestRequirementsForProjectByProjectId(projectId);

        for (Requirement requirement : requirements) {
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
            approvalRatio = (float) approved / (approved + unapproved);
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

        for (Requirement requirement : requirements) {
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

            if (requirement.getVersion().equals("V.1.0.")) {
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
            lockRatio = (float) locked / (locked + unlocked);
        }

        if (unapproved == 0) {
            if (approved == 0) {
                approvalRatio = 0;
            } else {
                approvalRatio = 1;
            }
        } else {
            approvalRatio = (float) approved / (approved + unapproved);
        }

        if (unchanged == 0) {
            if (changed == 0) {
                changeRatio = 0;
            } else {
                changeRatio = 1;
            }
        } else {
            changeRatio = (float) changed / (changed + unchanged);
        }

        return ProgressRatio.builder().lockRatio(lockRatio).approvalRatio(approvalRatio).changeRatio(changeRatio).build();
    }

    public List<RequirementDetailDto> getRequirementDetailDtos(Integer requirementId) {
        List<RequirementDetail> details = detailRepository.findAllByRequirement_requirementId(requirementId);
        List<RequirementDetailDto> returns = new ArrayList<>();

        for (RequirementDetail detail : details) {
            RequirementDetailDto dto = RequirementDetailDto.builder()
                    .requirementDetailId(detail.getRequirementDetailId())
                    .content(detail.getContent())
                    .status(detail.getStatus())
                    .build();
            returns.add(dto);
        }
        return returns;
    }

    @Transactional
    protected void createDetailWhenCreateRequirement(Integer requirementId, List<String> contents) {
        for (String content : contents) {
            RequirementDetail detail = RequirementDetail.builder()
                    .content(content)
                    .status("u")
                    .requirement(requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new))
                    .build();
            detailRepository.save(detail);
        }
    }

    // requirement 생성
    @Transactional
    public void createRequirement(Integer projectId, RequirementCreateDto requirementCreateDto) {
        Optional<Project> optionalProject = projectRepository.findByProjectId(projectId);
        Optional<User> optionalAuthor = userRepository.findByEmployeeId(requirementCreateDto.getAuthorEId());
        Optional<User> optionalManager = userRepository.findByEmployeeId(requirementCreateDto.getManagerEId());

        if (optionalProject.isPresent() && optionalAuthor.isPresent() && optionalManager.isPresent()) {
            Project project = optionalProject.get();
            User author = optionalAuthor.get();
            User manager = optionalManager.get();

            // orderIndex
            Integer orderIndex = requirementRepository.findMaxOrderIndexByProjectId(project.getProjectId());
            if (orderIndex == null) {
                orderIndex = 0; // 해당 프로젝트에 요구사항이 없다면 0으로 시작
            } else {
                orderIndex += 1;
            }

            Requirement requirement = Requirement.builder()
                    .isLock("u")
                    .approval("u")
                    .code(requirementCreateDto.getCode())
                    .requirementName(requirementCreateDto.getRequirementName())
                    .manager(manager)
                    .author(author)
                    .targetUser(requirementCreateDto.getTargetUser())
                    .version("V.1.0.")
                    .orderIndex(orderIndex)
                    .project(project)
                    .build();

            requirement = requirementRepository.save(requirement);
            // 양방향 -> 단방향으로 수정
            createDetailWhenCreateRequirement(requirement.getRequirementId(), requirementCreateDto.getDetailContents());
            requirementRepository.save(requirement);
            sendNotificationsToProjectParticipants(requirement, author);

        }
    }


    private void sendNotificationsToProjectParticipants(Requirement requirement, User author) {
        // 푸시 알림 전송
        List<ProjectAssignment> assignments = projectAssignmentRepository.findAllByProject_projectId(requirement.getProject().getProjectId());
        for (ProjectAssignment assignment : assignments) {

            User user = assignment.getUser();           // sender? receiver ?
            Notification notification = notificationRepository.findNotificationByUser(user).orElseThrow(NotificationNotFoundException::new);

            if (notification.getToken() != null) {
                NotificationRequestDto dto = NotificationRequestDto.builder()
                        .title("새로운 요구사항 추가")
                        .message("프로젝트 [" + requirement.getProject().getProjectTitle() + "]에 새 요구사항이 추가되었습니다.")
                        .type("NEW_REQUIREMENT")
                        .build();
                try {
                    notificationService.sendNotification(dto, user.getEmployeeId());
                    notificationService.saveNotificationMessage(requirement.getProject().getProjectTitle(), dto.getMessage(),
                            NotificationType.NEW_REQUIREMENT,
                            user.getUserId(),
                            author.getUserId(),       // sender 수정 필
                            assignment.getProject(),
                            requirement,
                            null
                            );
                } catch (Exception e) {
                    log.error("Notification sending failed for user " + user.getName());
                    throw new NotificationSendingFailedException();
                }
            }

        }
    }


    public RequirementSummaryDto getRequirement(Integer requirementId) {
        Requirement requirement = requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        UserInfoDto managerInfo = UserInfoDto.createUserInfo(requirement.getManager());
        UserInfoDto authorInfo = UserInfoDto.createUserInfo(requirement.getAuthor());

        RequirementSummaryDto requirementSummaryDto = RequirementSummaryDto.builder()
                .requirementId(requirement.getRequirementId())
                .orderIndex(requirement.getOrderIndex())
                .version(requirement.getVersion())
                .isLock(requirement.getIsLock())
                .approval(requirement.getApproval())
                .approvalComment(requirement.getApprovalComment())
                .code(requirement.getCode())
                .requirementName(requirement.getRequirementName())
                .details(getRequirementDetailDtos(requirementId))
                .manager(managerInfo)
                .targetUser(requirement.getTargetUser())
                .createdAt(requirement.getCreatedAt())
                .author(authorInfo)
                .build();

        return requirementSummaryDto;
    }


    @Transactional
    public void updateRequirement(Integer requirementId, RequirementUpdateDto udto) {
        Requirement requirement = requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        if (udto.getIsApproval() != null) {
            requirement.setApproval(udto.getIsApproval());
        }
        if (udto.getCode() != null) {
            requirement.setCode(udto.getCode());
        }
        if (udto.getRequirementName() != null) {
            requirement.setRequirementName(udto.getRequirementName());
        }
//        if (udto.getDetail() != null) {
//            requirement.setDetail(udto.getDetail());
//        }
        if (udto.getManagerEId() != null) {
            User manager = userRepository.findByEmployeeId(udto.getManagerEId()).orElseThrow(UserNotFoundException::new);
            requirement.setManager(manager);
        }
        if (udto.getAuthorEId() != null) {
            User author = userRepository.findByEmployeeId(udto.getAuthorEId()).orElseThrow(UserNotFoundException::new);
            requirement.setAuthor(author);
        }
        if (udto.getVersion() != null) {
            requirement.setVersion(udto.getVersion());
        }

        requirementRepository.save(requirement);
    }

    // update version by command(h:hold / r:restore)
    @Transactional
    public void updateVersion(Integer requirementId, String command) {
        Requirement requirement = requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        int holdCommand = 0;
        int restoreCommand = 0;

        if ("h".equals(command)) {
            holdCommand += 1;
        } else if ("r".equals(command)) {
            restoreCommand += 1;
        }

        String[] parts = requirement.getVersion().split("\\.");
        Integer front = Integer.parseInt(parts[1]) + holdCommand;
        Integer back = Integer.parseInt(parts[2]) + restoreCommand;

        String newVersion = String.format("V.%d.%d", front, back);

        // tobuild로 id, version 제외, 복제 저장
        Requirement requirement2 = requirementRepository.save(requirement
                .toBuilder()
                .requirementId(null)
                .version(newVersion)
                .isLock("u")
                .approval("u")
                .build());

        // 기존 requirement 상태 갱신
        requirement.setApproval(command);

        List<RequirementDetail> details = detailRepository.findAllByRequirement_requirementId(requirementId);
        for (RequirementDetail detail : details) {
            if (!"d".equals(detail.getStatus())) {
                detailRepository.save(detail
                        .toBuilder() // 추가 설정 외의 것(content, status)는 그대로 사용
                        .requirementDetailId(null)
                        .requirement(requirement2)
                        .build());
            }
        }

        // orderIndex는 차후 논의

    }

    @Transactional
    public void updateRequirementLock(Integer requirementId/*, String lock*/) {
        Requirement requirement = requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

//        if ("u".equals(lock)) {
//                requirement.setIsLock("u");
//            } else if ("l".equals(lock)) {
//                requirement.setIsLock("l");
        requirement.setIsLock("l");

        requirementRepository.save(requirement);
    }

    @Transactional
    public void updateRequirementApproval(Integer requirementId, ApprovalDto approvalDto) {
        Optional<Requirement> optionalRequirement = requirementRepository.findByRequirementId(requirementId);

        if (optionalRequirement.isPresent()) {
            Requirement requirement = optionalRequirement.get();
            switch (approvalDto.getApproval()) {
                case "u" -> requirement.setApproval("u");
                case "h" -> requirement.setApproval("h");
                case "a" -> requirement.setApproval("a");
            }

            requirement.setApprovalComment(approvalDto.getApprovalComment());
            requirementRepository.save(requirement);
        }
    }

    public List<RequirementSummaryDto> getRequirementsByCode(Integer projectId, String requirementCode) {
        List<Requirement> requirements = requirementRepository.findByProject_ProjectIdAndCode(projectId, requirementCode);
        List<RequirementSummaryDto> requirementSummaryDtos = new ArrayList<>();

        for (Requirement requirement : requirements) {
            RequirementSummaryDto requirementSummaryDto = getRequirement(requirement.getRequirementId());
            requirementSummaryDtos.add(requirementSummaryDto);
        }

        return requirementSummaryDtos;
    }

    public RequirementDetailDto addRequirementDetail(Integer requirementId, AddRequirementDetailDto dto) {
        Requirement requirement = requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        RequirementDetail detail = detailRepository.save(RequirementDetail.builder()
                .content(dto.getContent())
                .status("u")
                .requirement(requirement)
                .build());

        return RequirementDetailDto.builder()
                .requirementDetailId(detail.getRequirementDetailId())
                .content(detail.getContent())
                .status(detail.getStatus())
                .build();
    }

    @Transactional
    public void updateDetailStatus(Integer userId, Integer requirementId, Integer detailId, UpdateDetailStatusDto dto) {
        Requirement requirement = requirementRepository.findByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        if (userId.equals(requirement.getAuthor().getUserId())) {
            RequirementDetail detail = detailRepository.findByRequirementDetailId(detailId);
            detail.setStatus(dto.getCommand());
            detailRepository.save(detail);
        }
    }
}