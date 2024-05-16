package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationRequestDto;
import com.ssafy.d109.pubble.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserLocationService {

    private final ConcurrentHashMap<Integer, ConcurrentHashMap<String, UserLocationDto>> projectUserLocations = new ConcurrentHashMap<>();

    public UserLocationDto enter(User user, Integer projectId, UserLocationRequestDto dto) {
        UserLocationDto userLocationDto = UserLocationDto.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();

        projectUserLocations.computeIfAbsent(projectId, k -> new ConcurrentHashMap<>()).put(user.getEmployeeId(), userLocationDto);

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

    public List<UserLocationDto> getCurrentUserLocations(Integer projectId) {
        ConcurrentHashMap<String, UserLocationDto> userLocations = projectUserLocations.get(projectId);
        List<UserLocationDto> userLocationDtos = new ArrayList<>();
        if (userLocations == null) {
            return userLocationDtos;
        }
        userLocationDtos.addAll(userLocations.values());
        return userLocationDtos;
    }
}
