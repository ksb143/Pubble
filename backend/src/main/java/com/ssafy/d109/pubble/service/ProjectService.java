package com.ssafy.d109.pubble.service;


import com.ssafy.d109.pubble.dto.projectDto.*;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.EditableProjectsResponseDto;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.project.ProjectAccessDeniedException;
import com.ssafy.d109.pubble.exception.project.ProjectNotFoundException;
import com.ssafy.d109.pubble.exception.notification.NotificationSendingFailedException;
import com.ssafy.d109.pubble.repository.ProjectAssignmentRepository;
import com.ssafy.d109.pubble.repository.ProjectRepository;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ssafy.d109.pubble.entity.NotificationType.PROJECT;

@Service
@RequiredArgsConstructor
@Log4j2
public class ProjectService {

    //     비고 | 현재, 프로젝트 = 요구사항 명세서
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final RequirementService requirementService;
    private final RequirementRepository requirementRepository;
    private final NotificationService notificationService;

    private List<UserInfoDto> getDashboardUserInfos(Integer projectId) {

        List<User> users = projectAssignmentRepository.findUsersByProjectId(projectId);
        List<UserInfoDto> userInfoDtos = new ArrayList<>();
        for (User user : users) {
            userInfoDtos.add(UserInfoDto.createUserInfo(user));
        }

        return userInfoDtos;
    }

    public List<ProjectListDto> getProjectList(Integer userId) {
        List<Project> projects = projectAssignmentRepository.findAllProjectsByUserId(userId);
        List<ProjectListDto> projectListDtos = new ArrayList<>();

        for(Project project : projects) {
            List<String> people = projectAssignmentRepository.findUsernamesByProjectId(project.getProjectId());
            float progressRatio = requirementService.getApprovalRatio(project.getProjectId());

            ProjectListDto projectListDto = ProjectListDto.builder()
                    .projectId(project.getProjectId())
                    .prdId(project.getCode())
                    .projectTitle(project.getProjectTitle())
                    .people(people)
                    .startAt(project.getStartAt())
                    .endAt(project.getEndAt())
                    .status(project.getStatus())
                    .progressRatio(progressRatio)
                    .build();
            projectListDtos.add(projectListDto);
        }

        return projectListDtos;
    }

    @Transactional
    public void createProject(User user, ProjectCreateDto projectCreateDto) {

        Project project = Project.builder()
                .projectTitle(projectCreateDto.getProjectTitle())
                .startAt(projectCreateDto.getStartAt())
                .endAt(projectCreateDto.getEndAt())
                .code(projectCreateDto.getCode())
                .status(projectCreateDto.getStatus())
                .owner(user)
                .build();
        projectRepository.save(project);

        // participants mapping
        for (String userEID : projectCreateDto.getParticipantsEID()) {
            Optional<User> optionalUser = userRepository.findByEmployeeId(userEID);
            if (optionalUser.isPresent()) {
                User user1 = optionalUser.get();
                ProjectAssignment projectAssignment = ProjectAssignment.builder()
                        .user(user1)
                        .project(project)
                        .build();
                projectAssignmentRepository.save(projectAssignment);

                // 알림 메시지 생성 및 발송
                NotificationRequestDto reqDto = NotificationRequestDto.builder()
                        .title(projectCreateDto.getProjectTitle())
                        .message(user1.getName() + " " + user1.getPosition() + "님, '" + project.getProjectTitle() + "' 프로젝트에 참여하게 되었습니다.")
                        .type("PROJECT")
                        .build();
                /*
                CompletableFuture.runAsync(() -> {
                    try {
                        notificationService.sendNotification(reqDto, user1.getEmployeeId());
                        notificationService.saveNotificationMessage(reqDto.getMessage(), PROJECT, user1.getUserId(), null, project, null, null);
                    } catch (Exception e) {
                        log.error("Failed to send notification", e);
                        throw new NotificationSendingFailedException();
                    }
                });

                 */

                try {
                    notificationService.sendNotification(reqDto, user1.getEmployeeId());
                    notificationService.saveNotificationMessage(reqDto.getTitle(), reqDto.getMessage(), PROJECT, user1.getUserId(), user.getUserId(), project, null, null);
                } catch (Exception e) {
                    log.error("Failed to send notification", e);
                    throw new NotificationSendingFailedException();
                }
            }
        }
    }

    public ProjectDashboardDto getProjectDashboard(Integer projectId) {
        Project project = projectRepository.findByProjectId(projectId).orElseThrow(ProjectNotFoundException::new);

        // postponed
//        if (!projectAssignmentRepository.existsProjectAssignmentByUser_UserIdAndProject_ProjectId(userId, projectId)) {
//            throw new ProjectAccessDeniedException();
//        }

        ProjectDashboardDto projectDashboardDto = null;

        ProgressRatio progressRatio = requirementService.getProgressRatio(projectId);
        List<UserInfoDto> userInfoDtos = getDashboardUserInfos(projectId);

        projectDashboardDto = ProjectDashboardDto.builder()
                .projectId(projectId)
                .projectTitle(project.getProjectTitle())
                .startAt(project.getStartAt())
                .endAt(project.getEndAt())
                .status(project.getStatus())
                .code(project.getCode())
                .people(userInfoDtos)
                .lockRatio(progressRatio.getLockRatio())
                .approveRatio(progressRatio.getApprovalRatio())
                .changedRatio(progressRatio.getChangeRatio())
                .build();

        return projectDashboardDto;
    }

    public ProjectRequirementsDto getProjectRequirements(Integer projectId) {
        Optional<Project> optionalProject = projectRepository.findByProjectId(projectId);
        ProjectRequirementsDto projectRequirementsDto = null;

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            List<UserInfoDto> userInfoDtos = getDashboardUserInfos(projectId);
            List<RequirementSummaryDto> requirementSummaryDtos = new ArrayList<>();
            List<Requirement> requirements = requirementRepository.findLatestRequirementsForProjectByProjectId(projectId);

            for (Requirement requirement : requirements) {
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
                        .details(requirementService.getRequirementDetailDtos(requirement.getRequirementId()))
                        .manager(managerInfo)
                        .targetUser(requirement.getTargetUser())
                        .createdAt(requirement.getCreatedAt())
                        .author(authorInfo)
                        .build();
                requirementSummaryDtos.add(requirementSummaryDto);
            }

            projectRequirementsDto = ProjectRequirementsDto
                    .builder()
                    /*상단 정보*/
                    .projectId(projectId)
                    .projectTitle(project.getProjectTitle())
                    .startAt(project.getStartAt())
                    .endAt(project.getEndAt())
                    .status(project.getStatus())
                    .code(project.getCode())
                    .people(userInfoDtos)
                    /*상단 끝*/
                    .requirementSummaryDtos(requirementSummaryDtos)
                    .build();
        }

        return projectRequirementsDto;
    }

    @Transactional
    public void changeProjectStatus(Integer projectId, String status) {
        Optional<Project> optionalProject = projectRepository.findByProjectId(projectId);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            project.setStatus(status);
        }
    }

    public List<EditableProjectsResponseDto> getEditableProjects(Integer userId) {
        List<Object[]> projectsAndRequirements = projectRepository.findEditableProjectsAndRequirementsByUserId(userId);
        List<EditableProjectsResponseDto> dtos = new ArrayList<>();

        for (Object[] pr : projectsAndRequirements) {
            Project project = (Project) pr[0];
            Requirement requirement = (Requirement) pr[1];

            EditableProjectsResponseDto dto = EditableProjectsResponseDto.builder()
                    .projectId(project.getProjectId())
                    .projectCode(project.getCode())
                    .requirementId(requirement != null ? requirement.getRequirementId() : null)
                    .requirementCode(requirement != null ? requirement.getCode() : null)
                    .build();

            dtos.add(dto);
        }

        return dtos;

    }

    public List<EditableProjectsResponseDto> getUneditableProjects(Integer userId) {
        List<Object[]> projectsAndRequirements = projectRepository.findUneditableProjectsAndRequirementsByUserId(userId);
        List<EditableProjectsResponseDto> dtos = new ArrayList<>();

        for (Object[] pr : projectsAndRequirements) {
            Project project = (Project) pr[0];
            Requirement requirement = (Requirement) pr[1];

            EditableProjectsResponseDto dto = EditableProjectsResponseDto.builder()
                    .projectId(project.getProjectId())
                    .projectCode(project.getCode())
                    .requirementId(requirement != null ? requirement.getRequirementId() : null)
                    .requirementCode(requirement != null ? requirement.getCode() : null)
                    .build();

            dtos.add(dto);
        }

        return dtos;
    }
}
