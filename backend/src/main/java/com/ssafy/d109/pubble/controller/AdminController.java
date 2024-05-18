package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.adminDto.AddProjectParticipantDto;
import com.ssafy.d109.pubble.dto.adminDto.CreateUserDto;
import com.ssafy.d109.pubble.dto.adminDto.UpdateUserDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.service.AdminService;
import com.ssafy.d109.pubble.util.CommonUtil;
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
    private final CommonUtil commonUtil;
    private final AdminService adminService;

    @Operation(summary = "사용자 추가")
    @PostMapping("/users")
    public ResponseEntity<ResponseDto> createUser(@RequestBody CreateUserDto createUserDto) {
        if ("ADMIN".equals(commonUtil.getUser().getRole())) {
            adminService.createUser(createUserDto);
            response = new ResponseDto(true, "사용자 추가", null);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            response = new ResponseDto(false, "권한 없음", null);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @Operation(summary = "사용자 정보 수정") // 소요 발생시 속행
    @PatchMapping("/users")
    public ResponseEntity<ResponseDto> updateUser(@RequestBody UpdateUserDto updateUserDto) {
        if ("ADMIN".equals(commonUtil.getUser().getRole())) {
            adminService.updateUser(updateUserDto);

            response = new ResponseDto(true, "사용자 정보 변경", null);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            response = new ResponseDto(false, "권한 없음", null);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @Operation(summary = "프로젝트 참여 인원 추가")
    @PostMapping("/projects/{projectId}/add-participant")
    public ResponseEntity<ResponseDto> addProjectParticipant(@PathVariable Integer projectId, @RequestBody AddProjectParticipantDto dto) {
        if ("ADMIN".equals(commonUtil.getUser().getRole())) {
            adminService.addProjectParticipant(projectId, dto);

            response = new ResponseDto(true, "프로젝트 참여 인원 추가", null);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            response = new ResponseDto(false, "권한 없음", null);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
