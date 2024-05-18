// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getRequirement, getThread } from '@/apis/requirement';
import { RequirementInfo, ThreadInfo } from '@/types/requirementTypes';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
import Thread from '@/components/requirement/Thread';
// 6. asset
import Locked from '@/assets/icons/lock-closed.svg?react';
import Unlocked from '@/assets/icons/lock-open.svg?react';
import Pencil from '@/assets/icons/pencil-square.svg?react';

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
  const [threadList, setThreadList] = useState<ThreadInfo[]>([]); // api로 받은 스레드 리스트

  // 리치 에디터로 이동
  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

  useEffect(() => {
    (async () => {
      try {
        // 요구사항 정보 조회
        const response = await getRequirement(projectId, requirementId);
        setRequirementInfo(response.data);

        // 페이지 정보에 요구사항 정보 저장
        setPageType('requirement', {
          requirementId: response.data.requirementId,
          requirementCode: response.data.code,
          requirementName: response.data.requirementName,
          isRichPage: false,
        });
        console.log('요구사항 정보 조회 성공 : ', response.data);

        // 스레드 정보 조회
        const threadRes = await getThread(37);
        setThreadList(threadRes.resData.totalThreadList);
        console.log('스레드 조회 성공', threadRes.resData);
      } catch (error) {
        console.log('요구사항 정보 조회 실패 : ', error);
      }
    })();
  }, [projectId, requirementId]);

  return (
    <div className='flex h-full w-full justify-center py-3'>
      {/* 요구사항 */}
      <div className='relative mr-4 h-full w-1/2 rounded bg-white p-6 shadow'>
        <button
          className='absolute right-4 top-4 shrink-0 rounded-full bg-pubble p-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
          onClick={goRich}>
          <Pencil className='h-6 w-6 stroke-1' />
        </button>
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
                <div className='flex w-full'>
                  <div className='mx-2 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-gray-200 bg-gray-50'>
                    <Locked className='h-6 w-6 stroke-1' />
                  </div>
                  <div className='mx-2 flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-gray-200 bg-gray-50'>
                    <Unlocked className='h-6 w-6 stroke-1' />
                  </div>
                </div>
              ) : (
                <>
                  <Unlocked />
                </>
              )}
              <p>approval : {requirementInfo.approval}</p>
              <p>approvalComment : {requirementInfo.approvalComment}</p>
              <div className='my-3 border-b border-t py-3'>
                <ul>
                  {requirementInfo.details.map((detail) => (
                    <li
                      key={detail.requirementDetailId}
                      className='my-2 rounded border-2 border-pubble bg-plblue p-2'>
                      <p
                        className={`${detail.status === 'd' ? 'line-through' : ''}`}>
                        {detail.content}
                      </p>
                      <p>status : {detail.status}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {!requirementInfo && <p>요구사항 정보가 없습니다.</p>}
        </div>
      </div>
      {/* 스레드 */}
      {threadList.length > 0 &&
        threadList.map((thread) => (
          <Thread key={thread.userThreadId} data={thread} />
        ))}
    </div>
  );
};

export default RequirementPage;
