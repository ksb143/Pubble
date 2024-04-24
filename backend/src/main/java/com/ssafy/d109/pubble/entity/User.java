package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private Integer userId;

    @Column(name = "name")
    private String name;

    @Column(name = "employeeId", unique = true)
    private Integer employeeId;

    @Column(name = "delete_yn")
    private String deleteYN;

    @Column(name = "department")
    private String department;

    @Column(name = "position")
    private String position;

    @Column(name = "role")
    private String role;

    @Column(name = "password")
    private String password;


}
