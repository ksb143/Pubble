package com.ssafy.d109.pubble.dto.userLocationDto;

import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequirementThreadsDto {

    private Integer detailId;
    private List<UserThreadDto> userThreadDtos;

}
