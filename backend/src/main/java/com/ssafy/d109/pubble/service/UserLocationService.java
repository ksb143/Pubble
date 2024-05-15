package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationInfo;
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

    private final ConcurrentHashMap<Integer, List<UserLocationInfo>> projectUserLocations = new ConcurrentHashMap<>();

    public UserLocationInfo enter(User user, Integer projectId, UserLocationRequestDto dto) {
        UserLocationInfo userLocationInfo = UserLocationInfo.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();

        projectUserLocations.computeIfAbsent(projectId, k -> new ArrayList<>()).add(userLocationInfo);
        return userLocationInfo;
    }

    public UserLocationInfo move(User user, Integer projectId, UserLocationRequestDto dto) {
        List<UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            userLocations.stream()
                    .filter(uli -> uli.getUserInfoDto().getEmployeeId().equals(user.getEmployeeId()))
                    .forEach(uli -> {
                        uli.setLocationName(dto.getLocationName());
                        uli.setLocationUrl(dto.getLocationUrl());
                    });
        }

        return UserLocationInfo.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();
    }

    public String leave(User user, Integer projectId) {
        List<UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            userLocations.removeIf(uli -> uli.getUserInfoDto().getEmployeeId().equals(user.getEmployeeId()));
        }
        return user.getEmployeeId();
    }

    public List<UserLocationInfo> getCurrentUserLocations(Integer projectId) {
        return projectUserLocations.get(projectId);
    }
}
