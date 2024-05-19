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
import Profile from '@/components/layout/Profile';
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
  const [threadList, setThreadList] = useState<ThreadListInfo[]>([]); // api로 받은 스레드 리스트

  // 리치 에디터로 이동
  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

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
        console.log('요구사항 정보 조회 성공 : ', reqRes.data);

        // 스레드 정보 조회
        const threadRes = await getThread(reqRes.data.requirementId);
        setThreadList(threadRes.data);
        // console.log('스레드 조회 성공', threadRes.data);
      } catch (error) {
        console.log('요구사항 정보 조회 실패 : ', error);
      }
    })();
  }, [projectId, requirementId, setPageType]);

  return (
    <>
      <div className='flex h-full w-full justify-center py-3'>
        {/* 요구사항 전체 화면 */}
        <div className='relative mr-4 h-full w-1/2 rounded bg-white p-10 shadow'>
          {/* 리치에디터 이동 버튼 */}
          <button
            className='absolute right-4 top-4 shrink-0 rounded-full bg-pubble p-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
            onClick={goRich}>
            <Pencil className='h-6 w-6 stroke-2' />
          </button>
          {/* 요구사항 */}
          <div className='flex flex-col'>
            {!requirementInfo && <p>요구사항 정보가 없습니다.</p>}
            {requirementInfo && (
              <>
                {/* 타이틀 */}
                <div className='mb-5 flex items-baseline'>
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
                {requirementInfo.isLock === 'l' ? (
                  <div className='flex w-full items-center'>
                    <p>잠금 여부 : </p>
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
                <div className='flex shrink-0 items-end text-sm'>
                  <p className='mr-2'>
                    {extractDate(requirementInfo.createdAt)}
                  </p>
                  <p>{extractTime(requirementInfo.createdAt)}</p>
                </div>
                <div className='flex items-center'>
                  <Profile
                    width='3rem'
                    height='3rem'
                    name={requirementInfo.manager.name}
                    profileColor={requirementInfo.manager.profileColor}
                  />
                  <p className='ml-3'>
                    담당자 : {requirementInfo.manager.name}
                  </p>
                </div>
                <div className='flex items-center'>
                  <Profile
                    width='3rem'
                    height='3rem'
                    name={requirementInfo.author.name}
                    profileColor={requirementInfo.author.profileColor}
                  />
                  <p className='ml-3'>작성자 : {requirementInfo.author.name}</p>
                </div>
                <div className='my-3 border-b border-t py-3'>
                  <ul>
                    {requirementInfo.details.map((detail) => (
                      <li
                        key={detail.requirementDetailId}
                        className='my-2 rounded border-2 p-2 hover:border-pubble hover:bg-plblue'>
                        <p
                          className={`${detail.status === 'd' ? 'text-gray-300 line-through' : ''}`}>
                          {detail.content}
                        </p>
                        <p>status : {detail.status}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        {/* 스레드 */}
        <div className='flex w-1/3 flex-col'>
          {threadList.length > 0 &&
            threadList.map((threadInfo) => (
              <Thread
                key={threadInfo.detailId}
                data={threadInfo.userThreadDtos}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default RequirementPage;
