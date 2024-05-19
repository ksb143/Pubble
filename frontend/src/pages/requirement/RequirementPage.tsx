// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { getRequirement, getThread } from '@/apis/requirement';
import { RequirementInfo, ThreadListInfo } from '@/types/requirementTypes';
import { extractDate, extractTime } from '@/utils/datetime';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
import Thread from '@/components/requirement/Thread';
// 6. asset
import Locked from '@/assets/icons/lock-closed.svg?react';
import Unlocked from '@/assets/icons/lock-open.svg?react';
import Pencil from '@/assets/icons/pencil-square.svg?react';
import ChatBubble from '@/assets/icons/chat-bubble-left-right.svg?react';

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
  const [threadList, setThreadList] = useState<ThreadListInfo[]>([]); // api로 받은 스레드 리스트
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null); // 클릭한 디테일 항목 id

  // 스레드 데이터가 있는지 확인하는 변수
  const hasThreads = threadList.some(
    (thread) => thread.userThreadDtos.length > 0,
  );

  // 리치 에디터로 이동
  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

  // 요구사항, 스레드 정보 조회 및 저장
  useEffect(() => {
    (async () => {
      try {
        // 요구사항 정보 조회
        const reqRes = await getRequirement(projectId, requirementId);
        setRequirementInfo(reqRes.data);

        // 페이지 정보에 요구사항 정보 저장
        setPageType('requirement', {
          requirementId: reqRes.data.requirementId,
          requirementCode: reqRes.data.code,
          requirementName: reqRes.data.requirementName,
          isRichPage: false,
        });

        // 스레드 정보 조회
        const threadRes = await getThread(reqRes.data.requirementId);
        setThreadList(threadRes.data);
        console.log('스레드 정보 조회 : ', threadRes.data);
      } catch (error) {
        console.log('요구사항 정보 조회 실패 : ', error);
      }
    })();
  }, [projectId, requirementId, setPageType]);

  // 승인 여부에 따라 화면에 출력되는 텍스트를 반환하는 함수
  const getApprovalText = (approval: string) => {
    const approvalText: { [key: string]: JSX.Element } = {
      u: <p className='w-fit rounded-full bg-gray-100 px-3 py-1'>미승인</p>,
      a: <p className='w-fit rounded-full bg-plgreen px-3 py-1'>승인</p>,
      h: <p className='w-fit rounded-full bg-plred px-3 py-1'>보류</p>,
    };
    return approvalText[approval];
  };

  // 디테일 항목 클릭 함수
  const handleDetailClick = (detailId: number) => {
    setSelectedDetailId(detailId === selectedDetailId ? null : detailId);
  };

  return (
    <>
      <div className='flex h-full w-full justify-center py-3'>
        {/* 요구사항 */}
        <div
          className={`flex h-full w-1/2 flex-col rounded bg-white p-10 shadow transition-transform duration-700 ${hasThreads ? 'translate-x-0' : 'translate-x-1/3'}`}>
          {!requirementInfo && (
            <p className='flex justify-center'>요구사항 정보가 없습니다.</p>
          )}
          {requirementInfo && (
            <>
              <div className='mb-5 flex items-baseline justify-between'>
                {/* 요구사항코드, 요구사항명, 버전 */}
                <div className='flex items-baseline'>
                  <p className='border-r-2 pr-3 text-xl font-normal'>
                    {requirementInfo.code}
                  </p>
                  <p className='mx-3 text-2xl font-normal'>
                    {requirementInfo.requirementName}
                  </p>
                  <div className='rounded-full bg-gray-200 px-2 align-text-top text-sm'>
                    {requirementInfo.version}
                  </div>
                </div>

                {/* 잠금 여부 */}
                <div>
                  {requirementInfo.isLock === 'l' ? (
                    <>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 bg-gray-50'>
                        <Locked className='h-6 w-6 stroke-1' />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 bg-gray-50'>
                        <Unlocked className='h-6 w-6 stroke-1' />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className='relative'>
                {/* 리치에디터 이동 버튼 */}
                {requirementInfo.isLock === 'u' && (
                  <button
                    className='absolute bottom-0 right-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pubble p-1 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
                    onClick={goRich}>
                    <Pencil className='h-6 w-6 stroke-[1.5]' />
                  </button>
                )}

                {/* 승인 여부, 승인 코멘트 */}
                <div className='mb-3 flex items-center'>
                  {getApprovalText(requirementInfo.approval)}
                  <p className='ml-3'>{requirementInfo.approvalComment}</p>
                </div>

                {/* 작성자, 담당자, 작성일시 */}
                <div className='flex flex-col px-2'>
                  <p>
                    작성자 : {requirementInfo.author.name} (
                    {requirementInfo.author.department}{' '}
                    {requirementInfo.author.position})
                  </p>
                  <p className='my-2'>
                    담당자 : {requirementInfo.manager.name} (
                    {requirementInfo.manager.department}{' '}
                    {requirementInfo.manager.position})
                  </p>
                  <div className='flex shrink-0 items-center'>
                    <p>작성일 : </p>
                    <p className='mx-1'>
                      {extractDate(requirementInfo.createdAt)}
                    </p>
                    <p>{extractTime(requirementInfo.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* 요구사항 디테일 */}
              <ul className='my-3 border-t py-3'>
                {requirementInfo.details.map((detail) => (
                  <li
                    key={detail.requirementDetailId}
                    className={`group my-3 flex items-center justify-between rounded border p-4 hover:border-pubble ${selectedDetailId === detail.requirementDetailId ? 'border-pubble' : ''}`}
                    onClick={() =>
                      handleDetailClick(detail.requirementDetailId)
                    }>
                    <p
                      className={`text-lg ${detail.status === 'd' ? 'text-gray-300 line-through' : ''}`}>
                      {detail.content}
                    </p>
                    {/* hover 시 나오는 버튼 그룹 */}
                    <div className='flex opacity-0 transition duration-300 group-hover:opacity-100'>
                      <div className='flex min-h-9 min-w-9 items-center justify-center rounded-lg p-1 group-hover:border-2 group-hover:border-gray-200'>
                        <ChatBubble className='h-6 w-6 cursor-pointer stroke-gray-500 stroke-1' />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* 스레드 */}
        <div
          className={`flex h-[90vh] w-1/3 flex-col overflow-auto pl-8 pr-4 transition duration-700 ease-in ${threadList.length > 0 && hasThreads ? 'translate-x-0 opacity-100' : '-translate-x-1/2 opacity-0'}`}>
          {threadList.map((threadInfo) => (
            <Thread
              key={threadInfo.detailId}
              data={threadInfo.userThreadDtos}
              selected={selectedDetailId === threadInfo.detailId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RequirementPage;
