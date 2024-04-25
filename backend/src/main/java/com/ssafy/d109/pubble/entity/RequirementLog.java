package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "requirementLog")
public class RequirementLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "logId")
    private Integer logId;

    @Column(name = "changedAt")
    private LocalDateTime changedAt;

    @Column(name = "oldVersion")
    private String oldVersion;

    @Column(name = "newVersion")
    private String newVersion;

    @Column(name = "oldStatus")
    private String oldStatus;

    @Column(name = "newStatus")
    private String newStatus;

    @Column(name = "oldDetail")
    private String oldDetail;

    @Column(name = "newDetail")
    private String newDetail;

    @Column(name = "changedSummary")
    private String changedSummary;


    // 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirementId")
    private Requirement requirement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;




}
