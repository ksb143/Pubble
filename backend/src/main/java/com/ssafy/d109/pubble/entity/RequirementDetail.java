package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "requirementDetail")
public class RequirementDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requirementDetailId")
    private Integer requirementDetailId;

    @Column(name = "content")
    private String content; // 내용

    @Column(name = "status", length = 16)
    private String status;

//    @Column(name = "createdAt", updatable = false, nullable = false)
//    @CreationTimestamp
//    private LocalDateTime createdAt;

    // 연관 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirementId")
    private Requirement requirement;
}
