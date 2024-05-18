package com.ssafy.d109.pubble.dto.adminDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddProjectParticipantDto {
    List<String> additionalParticipants;
}
