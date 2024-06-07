package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.SimpleUserInfoDto;
import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.ProjectAssignmentRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectAssignmentRepository projectAssignmentRepository;

    public UserService(UserRepository userRepository, ProjectAssignmentRepository projectAssignmentRepository) {
        this.userRepository = userRepository;
        this.projectAssignmentRepository = projectAssignmentRepository;
    }



    // info list

    public List<SimpleUserInfoDto> getAllUserSimpleInfos() {
        return userRepository.getAllUserSimpleInfos();
    }

    public List<SimpleUserInfoDto> getProjectUserSimpleInfos(Integer projectId) {
        return userRepository.getProjectUserSimpleInfos(projectId);
    }

    public List<UserInfoDto> getAllUserInfos() {
        List<User> all = userRepository.findAll();
        List<UserInfoDto> userInfoDtos = new ArrayList<>();

        for (User one : all) {
            userInfoDtos.add(UserInfoDto.createUserInfo(one));
        }
        return userInfoDtos;
    }

    public List<UserInfoDto> getProjectUserInfos(Integer projectId) {
        List<User> participants = projectAssignmentRepository.findUsersByProjectId(projectId);
        List<UserInfoDto> userInfoDtos = new ArrayList<>();

        for (User one : participants) {
            userInfoDtos.add(UserInfoDto.createUserInfo(one));
        }
        return userInfoDtos;
    }
}
