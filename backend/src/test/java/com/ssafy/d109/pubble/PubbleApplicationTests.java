package com.ssafy.d109.pubble;

import com.ssafy.d109.pubble.dto.projectDto.RequirementCreateDto;
import com.ssafy.d109.pubble.service.RequirementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PubbleApplicationTests {

	@Autowired
	private RequirementService requirementService;

	@Test
	void contextLoads() {
	}

	// 환경변수명 잘 넣어주기
//	@Test
//	public void requirementCreator() {
//		// 수동 장입
//		int projectId = 2;
//
//		String code;
//		String requirementName;
//		String detail;
//		Integer managerId;
//		Integer authorId;
//		String targetUser;
//
//		for (int i = 1; i < 21 ; i++) {
//			code = "rqcode" + i;
//			requirementName = "대충항목이름" + i;
//			detail = "상세설명생략";
//			managerId = 6;
//			authorId = 6;
//			targetUser = "컨설턴트님";
//
//			RequirementCreateDto requirementCreateDto = RequirementCreateDto.builder()
//					.code(code)
//					.requirementName(requirementName)
//					.detail(detail)
//					.managerId(managerId)
//					.authorId(authorId)
//					.targetUser(targetUser)
//					.build();
//
//			requirementService.createRequirement(2, requirementCreateDto);
//		}
//	}

	@Test
	void updateVersion() {
		for(Integer i = 2; i < 5; i++) {
			requirementService.updateVersion(i, "h");
			requirementService.updateVersion(i+5, "r");
		}
	}
}
