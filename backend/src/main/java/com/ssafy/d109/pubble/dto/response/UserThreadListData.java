package com.ssafy.d109.pubble.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserThreadListData {

    List<UserThreadDto> totalThreadList;

}
