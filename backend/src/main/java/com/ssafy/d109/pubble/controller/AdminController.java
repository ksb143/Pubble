package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.adminDto.AddProjectParticipantDto;
import com.ssafy.d109.pubble.dto.adminDto.CreateUserDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.service.AdminService;
import com.ssafy.d109.pubble.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private ResponseDto response;;
    private final AdminService adminService;

    @Operation(summary = "사용자 추가")
    @PostMapping("/users")
    public ResponseEntity<ResponseDto> createUser(@RequestBody CreateUserDto createUserDto) {
        adminService.createUser(createUserDto);

        response = new ResponseDto(true, "사용자 추가", null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "프로젝트 참여 인원 추가")
    @PostMapping("/projects/{projectId}/add-participant")
    public ResponseEntity<ResponseDto> addProjectParticipant(@PathVariable Integer projectId, @RequestBody AddProjectParticipantDto dto) {
        adminService.addProjectParticipant(projectId, dto);

        response = new ResponseDto(true, "프로젝트 참여 인원 추가", null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
