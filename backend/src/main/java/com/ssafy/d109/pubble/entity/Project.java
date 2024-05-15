package com.ssafy.d109.pubble.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "projectId")
    private Integer projectId;

    @Column(name = "projectTitle")
    private String projectTitle;

    @Column(name = "startAt")
    private LocalDateTime startAt;

    @Column(name = "endAt")
    private LocalDateTime endAt;

    @Column(name = "status")
    private String status;

    @Column(name = "code", unique = true)
    private String code;

    // 연관 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner")
    private User owner;

    // Project 엔티티 내에 추가
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    private List<Requirement> requirements;

}
