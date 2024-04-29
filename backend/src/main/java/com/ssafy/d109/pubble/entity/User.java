package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import java.util.Set;

@Entity
@Builder
@Getter
@Setter
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

;    @Column(name = "employeeId", unique = true)
    private String employeeId;

    @Column(name = "deleteYN")
    private String deleteYN;

    @Column(name = "department")
    private String department;

    @Column(name = "position")
    private String position;

    @Column(name = "role")
    private String role;

    @Column(name = "password")
    private String password;

    @Column(name = "isApprovable")
    private String isApprovable;

    public Set<String> getRoles() {
        return Set.of(this.role);
    }


}
