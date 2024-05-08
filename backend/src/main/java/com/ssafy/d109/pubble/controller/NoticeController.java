package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.NoticeDto.NoticeCreateDto;
import com.ssafy.d109.pubble.dto.NoticeDto.NoticeResponseDto;
import com.ssafy.d109.pubble.dto.NoticeDto.NoticeSummaryDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.NoticeService;
import com.ssafy.d109.pubble.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

    private ResponseDto response;
    private final NoticeService noticeService;
    private final CommonUtil commonUtil;

    @GetMapping()
    public ResponseEntity<ResponseDto> getNoticeList() {
        List<NoticeSummaryDto> noticeList = noticeService.getNoticeList();

        response = new ResponseDto(true, "삭제처리 되지 않은 공지사항 리스트", noticeList);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{notice-id}")
    public ResponseEntity<ResponseDto> getNotice(@PathVariable("notice-id") Integer noticeId) {
        NoticeResponseDto notice = noticeService.getNotice(noticeId);

        response = new ResponseDto(true, "해당 공지사항 조회", notice);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping()
    public ResponseEntity<ResponseDto> createNotice(NoticeCreateDto noticeCreateDto) {
        User user = commonUtil.getUser();

        if ("ADMIN".equals(user.getRole())) {
            noticeService.createNotice(user, noticeCreateDto);
            response = new ResponseDto(true, "새 공지사항 생성", null);

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } else {
            response = new ResponseDto(false, "권한 없음", null);

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @PutMapping("/{notice-id}/delete")
    public ResponseEntity<ResponseDto> deleteNotice(@PathVariable("notice-id") Integer noticeId) {
        User user = commonUtil.getUser();

        if ("ADMIN".equals(user.getRole())) {
            noticeService.deleteNotice(noticeId);
            response = new ResponseDto(true, "해당 공지사항 삭제", null);

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } else {
            response = new ResponseDto(false, "권한 없음", null);

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
