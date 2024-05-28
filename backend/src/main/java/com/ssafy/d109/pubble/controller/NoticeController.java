package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.noticeDto.NoticeCreateDto;
import com.ssafy.d109.pubble.dto.noticeDto.NoticeResponseDto;
import com.ssafy.d109.pubble.dto.noticeDto.NoticeSummaryDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.NoticeService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

    private ResponseDto<?> response;
    private final NoticeService noticeService;
    private final CommonUtil commonUtil;

    @Operation(summary = "삭제되지 않은 공지사항 리스트 조회")
    @GetMapping()
    public ResponseEntity<ResponseDto<?>> getNoticeList() {
        List<NoticeSummaryDto> noticeList = noticeService.getNoticeList();

        response = new ResponseDto<>(true, "삭제처리 되지 않은 공지사항 리스트", noticeList);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "해당 공지사항 조회")
    @GetMapping("/{noticeId}")
    public ResponseEntity<ResponseDto<?>> getNotice(@PathVariable Integer noticeId) {
        NoticeResponseDto notice = noticeService.getNotice(noticeId);

        response = new ResponseDto<>(true, "해당 공지사항 조회", notice);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "공지사항 작성")
    @PostMapping()
    public ResponseEntity<ResponseDto<?>> createNotice(@RequestBody NoticeCreateDto noticeCreateDto) {
        User user = commonUtil.getUser();

        if ("ADMIN".equals(user.getRole())) {
            noticeService.createNotice(user, noticeCreateDto);
            response = new ResponseDto<>(true, "새 공지사항 생성", null);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } else {
            response = new ResponseDto<>(false, "권한 없음", null);

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @Operation(summary = "공지사항 삭제(d) 처리")
    @PatchMapping("/{noticeId}/delete")
    public ResponseEntity<ResponseDto<?>> deleteNotice(@PathVariable Integer noticeId) {
        User user = commonUtil.getUser();

        if ("ADMIN".equals(user.getRole())) {
            noticeService.deleteNotice(noticeId);

            response = new ResponseDto<>(true, "해당 공지사항 삭제", null);
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } else {

            response = new ResponseDto<>(false, "권한 없음", null);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}
