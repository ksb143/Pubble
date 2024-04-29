//package com.ssafy.d109.pubble.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//
//@Getter
//@Entity
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@Table(name = "version")
//public class Version {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "versionId")
//    private Integer versionId;
//
//    @Column(name = "version")
//    private String version;
//
//    @Column(name = "detail")
//    private String detail;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name = "updated_at")
//    private LocalDateTime updatedAt;
//
//    @Column(name = "hold_message")
//    private String holdMessage;
//
//    @Column(name = "manager")
//    private String manager;
//
//    @Column(name = "author")
//    private String author;
//
//    @Column(name = "order_index")
//    private Integer orderIndex;
//
//    // 연관 관계
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "requirementId")
//    private Requirement requirement;
//}
