package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.dto.response.UserThreadListData;
import com.ssafy.d109.pubble.dto.responseDto.UserThreadResponseDto;
import com.ssafy.d109.pubble.entity.UserThread;
import com.ssafy.d109.pubble.service.UserThreadService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requirements")
@Log4j2
public class UserThreadController {

    private final UserThreadService userThreadService;

    public UserThreadController(UserThreadService userThreadService) {
        this.userThreadService = userThreadService;
    }

    @GetMapping("/{requirementId}/thread")
    public ResponseEntity<UserThreadResponseDto> getAllThreads(@PathVariable Integer requirementId) {

        UserThreadResponseDto responseDto = new UserThreadResponseDto();
        List<UserThreadDto> userThreadList = userThreadService.getAllUserThreads(requirementId);

        if (userThreadList == null ) {
            responseDto.setMessage("UserThread Failed");
            responseDto.setResData(null);
            responseDto.setData(false);

            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }

        UserThreadListData listData = new UserThreadListData();
        listData.setTotalThreadList(userThreadList);

        responseDto.setMessage("UserThread Success");
        responseDto.setResData(listData);
        responseDto.setData(true);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);

    }
}
