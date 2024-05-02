package com.ssafy.d109.pubble.service;


import com.ssafy.d109.pubble.dto.projectDto.*;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.ProjectAssignmentRepository;
import com.ssafy.d109.pubble.repository.ProjectRepository;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    //     비고 | 현재, 프로젝트 = 요구사항 명세서
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final RequirementService requirementService;
    private final RequirementRepository requirementRepository;

    public List<ProjectListDto> getProjectList(Integer userId) {
        List<Project> projects = projectAssignmentRepository.findAllProjectsByUserId(userId);
        List<ProjectListDto> projectListDtos = new ArrayList<>();

        for(Project project : projects) {
            List<String> people = projectAssignmentRepository.findUsernamesByProjectId(project.getProjectId());

            // 진척도 - 승인 비율
            float progressRatio = requirementService.getApprovalRatio(project.getProjectId());

            projectListDtos.add(ProjectListDto.builder().prdId(project.getCode()).projectTitle(project.getProjectTitle()).people(people).startAt(project.getStartAt()).endAt(project.getEndAt()).status(project.getStatus()).progressRatio(progressRatio).build());
        }

        return projectListDtos;
    }

    // transactional?
    public void createProject(User user, ProjectCreateDto projectCreateDto) {
        Project project = Project.builder().projectTitle(projectCreateDto.getProjectTitle()).startAt(projectCreateDto.getStartAt()).endAt(projectCreateDto.getEndAt()).code(projectCreateDto.getCode()).status(projectCreateDto.getStatus()).owner(user).build();
        projectRepository.save(project);
    }

    public ProjectDashboardDto getProjectDashboard(Integer projectId) {
        Optional<Project> optionalProject = projectRepository.findByProjectId(projectId);
        ProjectDashboardDto projectDashboardDto = null;

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            List<User> users = projectAssignmentRepository.findUsersByProjectId(projectId);

            List<DashboardUserInfo> dashboardUserInfos = new ArrayList<>();
            for (User user : users) {
                dashboardUserInfos.add(DashboardUserInfo.builder().userId(user.getUserId()).name(user.getName()).employeeId(user.getEmployeeId()).department(user.getDepartment()).position(user.getPosition()).role(user.getRole()).isApprovable(user.getIsApprovable()).profileColor(user.getProfileColor()).build());
            }

            ProgressRatio progressRatio = requirementService.getProgressRatio(projectId);

            projectDashboardDto = ProjectDashboardDto.builder().projectId(projectId).projectTitle(project.getProjectTitle()).startAt(project.getStartAt()).endAt(project.getEndAt()).status(project.getStatus()).code(project.getCode()).people(dashboardUserInfos).lockRatio(progressRatio.getLockRatio()).approveRatio(progressRatio.getApprovalRatio()).changedRatio(progressRatio.getChangeRatio()).build();
        }

        return projectDashboardDto;
    }

    public ProjectRequirementsDto getProjectRequirements(Integer projectId) {
        Optional<Project> optionalProject = projectRepository.findByProjectId(projectId);
        ProjectRequirementsDto projectRequirementsDto = null;

        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            List<User> users = projectAssignmentRepository.findUsersByProjectId(projectId);
            List<Requirement> requirements = requirementRepository.findLatestRequirementsForProjectByProjectId(projectId);

            projectRequirementsDto = ProjectRequirementsDto.builder().projectId(project.getProjectId()).projectTitle(project.getProjectTitle()).startAt(project.getStartAt()).endAt(project.getEndAt()).status(project.getStatus()).code(project.getCode()).people(users).requirements(requirements).build();
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
}
