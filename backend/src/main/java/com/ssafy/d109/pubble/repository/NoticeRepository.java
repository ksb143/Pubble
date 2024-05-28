package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

    Optional<Notice> findByNoticeId(Integer noticeId);

    List<Notice> findAllByDeleteYN(String deleteYN);
}
