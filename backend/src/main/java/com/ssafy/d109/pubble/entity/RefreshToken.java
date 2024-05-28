package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "refreshToken")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refreshId")
    private Integer refreshId;

    private String employeeId;
    @Column(name = "refreshToken", length = 10000)
    private String refreshToken;
    private String expiration;

}
