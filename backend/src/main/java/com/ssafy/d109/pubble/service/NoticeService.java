package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.noticeDto.NoticeCreateDto;
import com.ssafy.d109.pubble.dto.noticeDto.NoticeResponseDto;
import com.ssafy.d109.pubble.dto.noticeDto.NoticeSummaryDto;
import com.ssafy.d109.pubble.entity.Notice;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.Notice.NoticeNotFoundException;
import com.ssafy.d109.pubble.repository.NoticeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public void createNotice(User author, NoticeCreateDto noticeCreateDto) {
        Notice notice = Notice.builder()
                .title(noticeCreateDto.getTitle())
                .content(noticeCreateDto.getContent())
                .category(noticeCreateDto.getCategory())
                .deleteYN("n")
                .author(author)
                .build();
        noticeRepository.save(notice);
    }

    public List<NoticeSummaryDto> getNoticeList() {
        List<NoticeSummaryDto> noticeSummaryDtos = new ArrayList<>();

        List<Notice> notices = noticeRepository.findAllByDeleteYN("n");

        for (Notice notice : notices) {

            NoticeSummaryDto noticeSummaryDto = NoticeSummaryDto.builder()
                    .noticeId(notice.getNoticeId())
                    .title(notice.getTitle())
                    .category(notice.getCategory())
                    .createdAt(notice.getCreatedAt())
                    .updatedAt(notice.getUpdatedAt())
                    .authorName(notice.getAuthor().getName())
                    .build();

            noticeSummaryDtos.add(noticeSummaryDto);
        }
        return noticeSummaryDtos;
    }

    public NoticeResponseDto getNotice(Integer noticeId) {
        // 리팩토링 - 예외처리 좀 더 생각하고..., 삭제처리 된 공지를 들어가려 할 때 막을지 말지
        Notice notice = noticeRepository.findByNoticeId(noticeId).orElseThrow(NoticeNotFoundException::new);

        return NoticeResponseDto.builder()
                .noticeId(noticeId)
                .title(notice.getTitle())
                .content(notice.getContent())
                .category(notice.getCategory())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .authorName(notice.getAuthor().getName())
                .build();
    }

    @Transactional
    public void deleteNotice(Integer noticeId) {
        Notice notice = noticeRepository.findByNoticeId(noticeId).orElseThrow(NoticeNotFoundException::new);

        notice.setDeleteYN("y");
        noticeRepository.save(notice);
    }
}
