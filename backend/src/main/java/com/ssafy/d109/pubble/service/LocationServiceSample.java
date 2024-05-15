package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class LocationServiceSample {

    private final ConcurrentHashMap<Integer, List<UserLocationInfo>> projectUserLocations = new ConcurrentHashMap<>();

    public void enter1(User user, UserLocationRequestDto dto, Integer projectId) {
        UserLocationInfo userLocationInfo = UserLocationInfo.builder()
                .userInfoDto(UserInfoDto.createUserInfo(user))
                .locationName(dto.getLocationName())
                .locationUrl(dto.getLocationUrl())
                .build();

        projectUserLocations.computeIfAbsent(projectId, k -> new ArrayList<>()).add(userLocationInfo);
    }

    public void enter()

    public void move(User user, UserLocationRequestDto dto, Integer projectId) {
        List<UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            userLocations.stream()
                    .filter(uli -> uli.getUserInfoDto().getEmployeeId().equals(user.getEmployeeId()))
                    .forEach(uli -> {
                        uli.setLocationName(dto.getLocationName());
                        uli.setLocationUrl(dto.getLocationUrl());
                    });
        }
    }

    public void leave(User user, Integer projectId) {
        List<UserLocationInfo> userLocations = projectUserLocations.get(projectId);
        if (userLocations != null) {
            userLocations.removeIf(uli -> uli.getUserInfoDto().getEmployeeId().equals(user.getEmployeeId()));
        }
    }

    public List<UserLocationInfo> getUserLocations(Integer projectId) {
        return projectUserLocations.getOrDefault(projectId, new ArrayList<>());
    }
}
