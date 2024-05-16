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

    private final ConcurrentHashMap<Integer, ConcurrentHashMap<String, UserLocationInfo>> projectUserLocations = new ConcurrentHashMap<>();

    public UserLocationInfo enter(User user, Integer projectId, UserLocationRequestDto dto) {
        UserLocationInfo userLocationInfo = UserLocationInfo.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();

        projectUserLocations.computeIfAbsent(projectId, k -> new ConcurrentHashMap<>()).put(user.getEmployeeId(), userLocationInfo);
        return userLocationInfo;
    }

    public UserLocationInfo move(User user, Integer projectId, UserLocationRequestDto dto) {
        ConcurrentHashMap<String, UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            UserLocationInfo userLocationInfo = userLocations.get(user.getEmployeeId());
            if (userLocationInfo != null) {
                userLocationInfo.setLocationName(dto.getLocationName());
                userLocationInfo.setLocationUrl(dto.getLocationUrl());
            }
        }

        return UserLocationInfo.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();
    }

    public String leave(User user, Integer projectId) {
        ConcurrentHashMap<String, UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            userLocations.remove(user.getEmployeeId());
        }
        return user.getEmployeeId();
    }

    public List<UserLocationInfo> getCurrentUserLocations(Integer projectId) {
        ConcurrentHashMap<String, UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        List<UserLocationInfo> userLocationInfos = new ArrayList<>();
        if (userLocations == null) {
            return userLocationInfos;
        }
        userLocationInfos.addAll(userLocations.values());
        return userLocationInfos;
    }
}
