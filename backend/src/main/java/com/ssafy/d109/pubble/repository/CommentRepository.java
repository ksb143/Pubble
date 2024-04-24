package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findAllByUser_userId(Integer userId);
    List<Comment> findAllByUserThread_userThreadId(Integer userThreadId);
}
