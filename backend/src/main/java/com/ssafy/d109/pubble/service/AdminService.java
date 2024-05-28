package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.adminDto.AddProjectParticipantDto;
import com.ssafy.d109.pubble.dto.adminDto.CreateUserDto;
import com.ssafy.d109.pubble.dto.adminDto.UpdateUserDto;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.project.ProjectNotFoundException;
import com.ssafy.d109.pubble.exception.user.UserNotFoundException;
import com.ssafy.d109.pubble.repository.ProjectAssignmentRepository;
import com.ssafy.d109.pubble.repository.ProjectRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;

    public void createUser(CreateUserDto dto) {
        User user = User.builder()
                .deleteYN("n")
                .department(dto.getDepartment())
                .employeeId(dto.getEmployeeId())
                .isApprovable(dto.getIsApprovable())
                .name(dto.getName())
                .password(dto.getPassword())
                .position(dto.getPosition())
                .profileColor(dto.getProfileColor())
                .role(dto.getRole())
                .build();
        userRepository.save(user);
    }

    @Transactional
    public void updateUser(UpdateUserDto updateUserDto) {
        User user = userRepository.findByEmployeeId(updateUserDto.getEmployeeId()).orElseThrow(UserNotFoundException::new);

        if (updateUserDto.getName() != null) {
            user.setName(updateUserDto.getName());
        }
//        if (updateUserDto.getEmployeeId() != null) {
//            user.setEmployeeId(updateUserDto.getEmployeeId());
//        }
        if (updateUserDto.getDeleteYN() != null) {
            user.setDeleteYN(updateUserDto.getDeleteYN());
        }
        if (updateUserDto.getDepartment() != null) {
            user.setDepartment(updateUserDto.getDepartment());
        }
        if (updateUserDto.getPosition() != null) {
            user.setPosition(updateUserDto.getPosition());
        }
        if (updateUserDto.getRole() != null) {
            user.setRole(updateUserDto.getRole());
        }
        if (updateUserDto.getPassword() != null) {
            user.setPassword(updateUserDto.getPassword());
        }
        if (updateUserDto.getIsApprovable() != null) {
            user.setIsApprovable(updateUserDto.getIsApprovable());
        }
        if (updateUserDto.getProfileColor() != null) {
            user.setProfileColor(updateUserDto.getProfileColor());
        }

        userRepository.save(user);
    }

    @Transactional
    public void addProjectParticipant(Integer projectId, AddProjectParticipantDto dto) {
        Project project = projectRepository.findByProjectId(projectId).orElseThrow(ProjectNotFoundException::new);

        List<String> additionalParticipants = dto.getAdditionalParticipants();
        for (String participantEID : additionalParticipants) {
            User user = userRepository.findByEmployeeId(participantEID).orElseThrow(UserNotFoundException::new);

            ProjectAssignment projectAssignment = ProjectAssignment.builder()
                    .project(project)
                    .user(user)
                    .build();
            projectAssignmentRepository.save(projectAssignment);
        }
    }

}
