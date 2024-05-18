package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.adminDto.AddProjectParticipantDto;
import com.ssafy.d109.pubble.dto.adminDto.CreateUserDto;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.Project.ProjectNotFoundException;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
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
                .department(dto.getDepartment())
                .employeeId(dto.getEmployeeId())
                .isApprovable(dto.getIsApprovable())
                .name(dto.getName())
                .password(dto.getPassword())
                .position(dto.getPosition())
                .role(dto.getRole())
                .build();
        userRepository.save(user)
    }

    @Transactional
    public void addProjectParticipant(Integer projectId, AddProjectParticipantDto dto) {
        System.out.println("dto = " + dto.toString());
        Project project = projectRepository.findByProjectId(projectId).orElseThrow(ProjectNotFoundException::new);

        List<String> additionalParticipants = dto.getAdditionalParticipants();
        for (String participantEID : additionalParticipants) {
            System.out.println("participantEID = " + participantEID);
            User user = userRepository.findByEmployeeId(participantEID).orElseThrow(UserNotFoundException::new);

            ProjectAssignment projectAssignment = ProjectAssignment.builder()
                    .project(project)
                    .user(user)
                    .build();
            projectAssignmentRepository.save(projectAssignment);
        }
    }

}
