// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getRequirement } from '@/apis/requirement';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
// 6. asset

const RequirementPage = () => {
  const navigate = useNavigate();
  const {
    projectId,
    projectCode,
    requirementId,
    requirementCode,
    setPageType,
  } = usePageInfoStore();
  const [requirementInfo, setRequirementInfo] = useState(null);

  // 리치 에디터로 이동
  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

  // 요구사항 정보 조회
  useEffect(() => {
    (async () => {
      try {
        const response = await getRequirement(projectId, requirementId);
        setRequirementInfo(response.data);
        // 페이지 정보에 요구사항 정보 저장
        setPageType('requirement', {
          requirementId: response.data.requirementId,
          requirementCode: response.data.code,
          requirementName: response.data.requirementName,
          isRichPage: false,
        });
      } catch (error) {
        console.log('요구사항 정보 조회 실패 : ', error);
      }
    })();
  }, []);

  return (
    <div className='flex h-full w-full items-center justify-center py-3'>
      <div className='h-full w-1/3 rounded bg-white p-6 shadow'>
        <div className='flex flex-col'>
          <p>
            version : {requirementInfo?.version} // 버전 v.1.0, r는 restore
            복제버전, h는 hold 보류버전 ... 회색 태그(배지)로 표시
          </p>
          <p>
            isLock : {requirementInfo?.isLock} // u는 unlock, l은 lock ...
            자물쇠 이미지로 표시
          </p>
          <p>
            approval : {requirementInfo?.approval} // u는 기본, a는 approve, h는
            hold ... 색깔 태그(배지)로 표시
          </p>
          <p>
            approvalComment : {requirementInfo?.approvalComment} // 승인 보류
            이유
          </p>
          <p>code : {requirementInfo?.code} // 요구사항 코드</p>
          <p>
            requirementName : {requirementInfo?.requirementName} // 요구사항
            이름
          </p>
          <div>
            <ul>
              {requirementInfo?.details.map((detail) => (
                <li key={detail.requirementDetailId}>
                  <p>Content: {detail.content}</p>
                  <p>Status: {detail.status}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className='my-3 w-1/4 rounded bg-pubble py-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
          onClick={goRich}>
          에디터 이동
        </button>
      </div>
    </div>
  );
};

export default RequirementPage;
