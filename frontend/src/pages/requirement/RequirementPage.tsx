// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getRequirement } from '@/apis/requirement';
import { RequirementInfo } from '@/types/requirementTypes';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
// 6. asset
import LockClosed from '@/assets/icons/lock-closed.svg?react';
import LockOpen from '@/assets/icons/lock-open.svg?react';

const RequirementPage = () => {
  const navigate = useNavigate();
  const {
    projectId,
    projectCode,
    requirementId,
    requirementCode,
    setPageType,
  } = usePageInfoStore();
  const [requirementInfo, setRequirementInfo] =
    useState<RequirementInfo | null>(null); // api로 받은 요구사항 정보

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
  }, [projectId, requirementId]);

  return (
    <div className='flex h-full w-full items-center justify-center py-3'>
      <div className='h-full w-1/2 rounded bg-white p-6 shadow'>
        <div className='flex flex-col'>
          {requirementInfo && (
            <>
              <div className='flex items-baseline'>
                <p className='text-2xl font-normal'>{requirementInfo.code}</p>
                <p className='mx-3 text-2xl font-normal'>
                  {requirementInfo.requirementName}
                </p>
                <div
                  className={`rounded-full px-2 align-text-top text-sm ${requirementInfo.version === 'h' ? 'bg-plred' : 'bg-gray-200 '}`}>
                  {requirementInfo.version === 'h'
                    ? '보류'
                    : `${requirementInfo.version}`}
                </div>
              </div>
              {requirementInfo.isLock === 'l' ? (
                <LockClosed className='h-4 w-4' />
              ) : (
                <LockOpen />
              )}

              <p>approval : {requirementInfo.approval}</p>
              <p>approvalComment : {requirementInfo.approvalComment}</p>
              <div className='my-3 border-b border-t py-3'>
                <ul>
                  {requirementInfo.details.map((detail) => (
                    <li key={detail.requirementDetailId}>
                      <p>Content: {detail.content}</p>
                      <p>Status: {detail.status}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {!requirementInfo && <p>요구사항 정보가 없습니다.</p>}
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
