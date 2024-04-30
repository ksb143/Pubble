package com.ssafy.d109.pubble.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "requirement")
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requirementId")
    private Integer requirementId;

    @Column(name = "order_index") // 순서 인덱스
    private Integer orderIndex;

    @Column(name = "is_lock", length = 1) // 잠금 여부 u, l (unlocked, locked)
    private String isLock;

    @Column(name = "approval", length = 1) // 승인 여부 u, h, a (unapproved, holded, approved)
    private String approval;

    @Column(name = "approval_comment") // 승인/보류 메세지
    private String approvalComment;

    @Column(name = "code") // id
    private String code;

    @Column(name = "requirement_name") // 요구사항명
    private String requirementName;

    @Column(name = "detail") // 상세설명
    private String detail;

    @Column(name = "manager") // 담당자
    private String manager;

    @Column(name = "author") // 작성자
    private String author;

    @Column(name = "target_user") // 타겟 이용자
    private String targetUser;

    @Column(name = "latest_version") // 최근 버전
    private String latest_version;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 연관 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId")
    private Project project;
}
