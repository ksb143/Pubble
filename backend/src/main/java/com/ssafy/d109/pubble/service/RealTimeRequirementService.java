package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.projectDto.AddRequirementDetailDto;
import com.ssafy.d109.pubble.dto.projectDto.CommentCreateDto;
import com.ssafy.d109.pubble.dto.projectDto.RequirementDetailDto;
import com.ssafy.d109.pubble.dto.realtimeRequirementDto.StompCommentCreateDto;
import com.ssafy.d109.pubble.dto.realtimeRequirementDto.StompDetailCreateDto;
import com.ssafy.d109.pubble.dto.realtimeRequirementDto.StompThreadCreateDto;
import com.ssafy.d109.pubble.dto.realtimeRequirementDto.StompDto;
import com.ssafy.d109.pubble.dto.response.CommentResponseData;
import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RealTimeRequirementService {

    private final CommonUtil commonUtil;
    private final RequirementService requirementService;
    private final UserThreadService userThreadService;

    public StompDto<?> realtimeRequirementService(StompDto<?> stompDto) {
        switch (stompDto.getOperation()) {
            /*
            {
                operation : "createDetail",
                data : {
                            requiementId : Integer,
                            content : string,
                        }
            }
             */
            case "createDetail" -> {
                StompDetailCreateDto data = (StompDetailCreateDto) stompDto.getData();
                // 리팩토링...
                RequirementDetailDto requirementDetailDto = requirementService.addRequirementDetail(data.getRequirementId(), AddRequirementDetailDto.builder().content(data.getContent()).build());

                return StompDto.builder()
                        .operation("createDetail")
                        .data(requirementDetailDto)
                        .build();
            }
            /*
            {
                operation : "createThread",
                data : {
                            detailId : Integer,
                        }
            }
             */
            case "createThread" -> {
                User user = commonUtil.getUser();
                StompThreadCreateDto data = (StompThreadCreateDto) stompDto.getData();
                UserThreadDto userThreadDto = userThreadService.createUserThread(user, data.getDetailId());

                return StompDto.builder()
                        .operation("createThread")
                        .data(userThreadDto)
                        .build();
            }
            /*
            {
                operation : "createComment",
                data : {
                            userThreadId : Integer,
                            content : String,
                            projectId : Integer,
                            requirementId : Integer,
                            receiverInfo : {
                                isMentioned : Boolean,
                                receiverId : String,      // employeeId
                                receiverName : String
                            }
                        }
            }
             */
            case "createComment" -> {
                User user = commonUtil.getUser();
                StompCommentCreateDto data = (StompCommentCreateDto) stompDto.getData();

                CommentCreateDto built = CommentCreateDto.builder()
                        .content(data.getContent())
                        .projectId(data.getProjectId())
                        .requirementId(data.getRequirementId())
                        .receiverInfo(data.getReceiverInfo())
                        .build();

                CommentResponseData commentResponseData = userThreadService.createComment(user, data.getUserThreadId(), built);

                return StompDto.builder()
                        .operation("createComment")
                        .data(commentResponseData)
                        .build();
            }
        }

        return StompDto.builder()
                .operation("error")
                .data("관리자 문의")
                .build();
    }
}
