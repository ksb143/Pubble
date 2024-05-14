package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.dto.SimpleUserInfoDto;
import com.ssafy.d109.pubble.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Boolean existsByEmployeeId(String employeeId);
    Optional<User> findByEmployeeId(String employeeId);
    Optional<User> findByUserId(Integer userId);

    List<User> findAll();

    // 모든 User에 대하여 사번, 이름
    @Query("SELECT new com.ssafy.d109.pubble.dto.SimpleUserInfoDto(u.employeeId, u.name) FROM User u")
    List<SimpleUserInfoDto> getAllUserSimpleInfos();

    @Query("SELECT new com.ssafy.d109.pubble.dto.SimpleUserInfoDto(u.employeeId, u.name)" +
            "FROM ProjectAssignment pa JOIN pa.user u WHERE pa.project.projectId = :projectId")
    List<SimpleUserInfoDto> getProjectUserSimpleInfos(Integer projectId);
}
