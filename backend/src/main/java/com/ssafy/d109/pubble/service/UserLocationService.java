package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.dto.userLocationDto.AllUserLocationResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationRequestDto;
import com.ssafy.d109.pubble.entity.ProjectAssignment;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.ProjectAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLocationService {

    private final ProjectAssignmentRepository projectAssignmentRepository;
    private final ConcurrentHashMap<Integer, ConcurrentHashMap<String, UserLocationDto>> projectUserLocations = new ConcurrentHashMap<>();

    public UserLocationDto enter(User user, Integer projectId, UserLocationRequestDto dto) {
        UserLocationDto userLocationDto = UserLocationDto.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();
        System.out.println("userLocationDto = " + userLocationDto.toString());

        projectUserLocations.computeIfAbsent(projectId, k -> new ConcurrentHashMap<>()).put(user.getEmployeeId(), userLocationDto);
        System.out.println("===========================enter==========================================");
        System.out.println("projectUserLocations = " + projectUserLocations);
        System.out.println("projectUserLocations = " + projectUserLocations.toString());
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId));
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId).toString());
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId).values());
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId).values().toString());


        userLocationDto.setOperation("e");
        return userLocationDto;
    }

    public UserLocationDto move(User user, Integer projectId, UserLocationRequestDto dto) {
        ConcurrentHashMap<String, UserLocationDto> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            UserLocationDto userLocationDto = userLocations.get(user.getEmployeeId());
            if (userLocationDto != null) {
                userLocationDto.setLocationName(dto.getLocationName());
                userLocationDto.setLocationUrl(dto.getLocationUrl());
            }
        }

        return UserLocationDto.builder()
                .operation("m")
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();
    }

    public UserLocationDto leave(User user, Integer projectId) {
        ConcurrentHashMap<String, UserLocationDto> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            userLocations.remove(user.getEmployeeId());
        }
        return UserLocationDto.builder()
                .operation("l")
                .employeeId(user.getEmployeeId())
                .build();
    }

    public AllUserLocationResponseDto getAllUserLocations(Integer projectId) {
        System.out.println("projectId = " + projectId);
        List<User> participants = projectAssignmentRepository.findUsersByProjectId(projectId);
        System.out.println("participants = " + participants.toString());
        ConcurrentHashMap<String, UserLocationDto> userLocations = projectUserLocations.get(projectId);
        System.out.println("===========================getAllUserLocations==========================================");
        System.out.println("projectUserLocations = " + projectUserLocations);
        System.out.println("projectUserLocations = " + projectUserLocations.toString());
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId));
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId).toString());
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId).values());
        System.out.println("projectUserLocations = " + projectUserLocations.get(projectId).values().toString());

        // userLocations가 null일 경우 빈 HashMap을 사용
        if (userLocations == null) {
            userLocations = new ConcurrentHashMap<>();
        }

        Set<String> connectedEmployeeIds = userLocations.values().stream()
                .map(UserLocationDto::getEmployeeId)
                .collect(Collectors.toSet());
        System.out.println("connectedEmployeeIds.toString() = " + connectedEmployeeIds.toString());

        // 접속자
        List<UserLocationDto> connectedUserLocations = new ArrayList<>(userLocations.values());

        // 비접속자
        // 전체 유저 중 - 비접속자 유저를 걸러 - 각각 userLocationDto로 담아 - 리스트로 반환
        List<UserLocationDto> nonConnectedUserLocations = participants.stream()
                .filter(user -> {
                    boolean isConnected = connectedEmployeeIds.contains(user.getEmployeeId());
                    System.out.println("User ID: " + user.getEmployeeId() + " isConnected: " + isConnected);
                    return !isConnected;
                })
                .map(user -> UserLocationDto.builder()
                        .employeeId(user.getEmployeeId())
                        .userInfoDto(UserInfoDto.createUserInfo(user))
                        .locationName("비접속 상태")
                        .locationUrl("비접속 상태")
                        .build())
                .toList();

        return AllUserLocationResponseDto.builder()
                .nonConnected(nonConnectedUserLocations)
                .connected(connectedUserLocations)
                .build();
    }
}
