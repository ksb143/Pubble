package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "userThread")
public class UserThread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userThreadId")
    private Integer userThreadId;

    @Column(name = "lockYN")
    private String lockYN;

    // 연관 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirementDetailId")
    private RequirementDetail requirementDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user; // 스레드 생성한 사람이자, 스레드를 잠글 수 있는 사람
}
