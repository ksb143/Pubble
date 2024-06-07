// 1. react
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import {
  getRequirement,
  lockRequirement,
  getThread,
  createThread,
  createRequirementDetail,
  updateRequirementDetailStatus,
} from '@/apis/requirement';
import { RequirementInfo } from '@/types/requirementType';
import { ThreadListInfo } from '@/types/threadType';
import { extractDate, extractTime } from '@/utils/datetime';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
import useUserStore from '@/stores/userStore';
// 5. component
import Thread from '@/components/requirement/Thread';
import AlertModal from '@/components/layout/AlertModal';
// 6. asset
import Locked from '@/assets/icons/lock-closed.svg?react';
import Unlocked from '@/assets/icons/lock-open.svg?react';
import PencilSquare from '@/assets/icons/pencil-square.svg?react';
import ChatBubble from '@/assets/icons/chat-bubble-left-right.svg?react';
import PanelOpen from '@/assets/icons/panel-left-open.svg?react';
import Ellipsis from '@/assets/icons/ellipsis-vertical.svg?react';
import Pencil from '@/assets/icons/pencil.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

const RequirementPage = () => {
  const navigate = useNavigate();
  const { employeeId } = useUserStore();
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

  const [isAlertOpen, setIsAlertOpen] = useState(false); // 알림 모달 오픈 여부
  const [alertModalProps, setAlertModalProps] = useState({
    text: '',
    buttonsType: 'yesno' as 'autoclose' | 'confirm' | 'yesno',
    status: 'warning' as 'success' | 'warning',
    closeModal: () => setIsAlertOpen(false),
    onConfirm: undefined as (() => void) | undefined,
  }); // 알림 모달 props 정보

  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null); // 클릭한 디테일 항목 id
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // 클릭한 드롭다운 id
  const [isThreadsOpen, setIsThreadsOpen] = useState(false); // 스레드 열기 버튼 클릭 여부
  // 스레드 데이터가 있는지 확인하는 변수
  const hasThreads = threadList.some(
    (thread) => thread.userThreadDtos.length > 0,
  );
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [inputDetail, setInputDetail] = useState<string>('');
  const [detailsUpdated, setDetailsUpdated] = useState(false);
  const [threadsUpdated, setThreadsUpdated] = useState(false);

  const updateCommentList = () => {
    setThreadsUpdated((prev) => !prev); // useEffect 트리거를 위한 상태 업데이트
  };

  // 요구사항 잠금 버튼 클릭 함수
  const handleLockButtonClick = () => {
    setAlertModalProps({
      text: '요구사항은 다시 잠금을 풀 수 없습니다. 작성한 내용을 확정하시겠어요?',
      buttonsType: 'yesno',
      status: 'warning',
      closeModal: () => setIsAlertOpen(false),
      onConfirm: handleRequirementLock,
    });
    setIsAlertOpen(true);
  };

  // 요구사항 잠금 함수
  const handleRequirementLock = async () => {
    try {
      await lockRequirement(projectId, requirementId);
      setAlertModalProps({
        text: '요구사항 잠금 성공',
        buttonsType: 'autoclose',
        status: 'success',
        closeModal: () => setIsAlertOpen(false),
        onConfirm: undefined,
      });
      setIsAlertOpen(true);
      setDetailsUpdated((prev) => !prev);
    } catch (error) {
      console.log('요구사항 잠금 실패 : ', error);
    }
  };

  // 리치 에디터 이동 함수
  const goRich = () => {
    navigate(`/project/${projectCode}/requirement/${requirementCode}/detail`);
  };

  // 승인 여부에 따라 화면에 출력되는 텍스트를 반환하는 함수
  const getApprovalText = (approval: string) => {
    const approvalText: { [key: string]: JSX.Element } = {
      u: <p className='w-fit rounded-full bg-gray-100 px-3 py-1'>미승인</p>,
      a: <p className='w-fit rounded-full bg-plgreen px-3 py-1'>승인</p>,
      h: <p className='w-fit rounded-full bg-plred px-3 py-1'>보류</p>,
    };
    return approvalText[approval];
  };

  const handleToggleThreads = () => {
    setIsThreadsOpen(!isThreadsOpen);
  };

  // 디테일 항목 클릭 함수
  const handleDetailClick = (detailId: number) => {
    setSelectedDetailId(detailId === selectedDetailId ? null : detailId);
  };

  // 요구사항, 스레드 정보 조회 및 저장
  useEffect(() => {
    (async () => {
      try {
        // 요구사항 정보 조회
        const reqRes = await getRequirement(projectId, requirementId);
        setRequirementInfo(reqRes.data);
        console.log('reqRes', reqRes.data);

        // 페이지 정보 업데이트
        setPageType('requirement', {
          requirementId: reqRes.data.requirementId,
          requirementCode: reqRes.data.code,
          requirementName: reqRes.data.requirementName,
          isRichPage: false,
        });

        // 스레드 정보 조회
        const threadRes = await getThread(reqRes.data.requirementId);
        setThreadList(threadRes.data);
      } catch (error) {
        console.log('요구사항 정보 조회 실패 : ', error);
      }
    })();
  }, [projectId, requirementId, setPageType, detailsUpdated, threadsUpdated]);

  // mapping된 스레드가 있는지 확인하는 함수
  const checkThreadExist = (detailId: number) => {
    // threadList에서 detailId와 일치하는 항목이 있는지 검사
    return threadList.some(
      (thread) =>
        thread.detailId === detailId && thread.userThreadDtos.length > 0,
    );
  };

  // 스레드 생성 함수
  const handleChatClick = async (detailId: number) => {
    try {
      await createThread(requirementId, detailId);
      toggleDropdown(detailId); // 스레드 생성 버튼 클릭 시 드롭다운 닫기
      setThreadsUpdated((prev) => !prev); // 상태 플립하여 useEffect 트리거
      setIsThreadsOpen(true); // 스레드 열기
    } catch (error) {
      console.log('스레드 생성 실패 : ', error);
    }
  };

  // 드롭다운 토글 함수
  const toggleDropdown = (detailId: number) => {
    if (openDropdownId === detailId) {
      setOpenDropdownId(null); // 이미 열린 드롭다운을 닫음
    } else {
      setOpenDropdownId(detailId); // 새 드롭다운을 열음
    }
  };

  const handlePlusClick = async () => {
    if (inputDetail.trim() === '') {
      return;
    }

    try {
      await createRequirementDetail(requirementId, inputDetail);
      setInputDetail('');
      setDetailsUpdated((prev) => !prev); // 상태 플립하여 useEffect 트리거
    } catch (error) {
      console.log('요구사항 항목 추가 실패 : ', error);
    }
  };

  const toggleDetailStatus = (detailId: number, status: string) => async () => {
    try {
      await updateRequirementDetailStatus(
        requirementId,
        detailId,
        status === 'd' ? 'a' : 'd',
      );
      toggleDropdown(detailId); // 드롭다운 닫기
      setDetailsUpdated((prev) => !prev); // 상태 플립하여 useEffect 트리거
    } catch (error) {
      console.log('요구사항 항목 상태 변경 실패 : ', error);
    }
  };

  return (
    <>
      {/* 알림 모달 */}
      {isAlertOpen && (
        <AlertModal
          text={alertModalProps.text}
          buttonsType={alertModalProps.buttonsType}
          status={alertModalProps.status}
          closeModal={alertModalProps.closeModal}
          onConfirm={alertModalProps.onConfirm}
        />
      )}
      <div className='flex h-full w-full items-center justify-center py-3 transition-all duration-500'>
        <div className='flex h-full min-w-[40vw] max-w-[90vw] justify-center rounded bg-white shadow'>
          {/* 요구사항 컨테이너 */}
          <div className='flex h-full w-full min-w-[40vw] max-w-[50vw] flex-col items-center overflow-y-auto px-6 py-4'>
            {!requirementInfo && (
              <p className='translate-y-10 text-2xl font-normal'>
                요구사항 정보를 불러오지 못했습니다.
              </p>
            )}
            {requirementInfo && (
              <>
                {/* 버튼 컨테이너 */}
                <div className='flex w-full justify-end'>
                  {/* 리치에디터 이동 버튼 */}
                  {requirementInfo.isLock === 'u' && (
                    <button
                      className='flex h-8 w-8 items-center justify-center rounded bg-pubble text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
                      onClick={goRich}>
                      <PencilSquare className='h-5 w-5' />
                    </button>
                  )}
                  {/* 잠금 버튼 */}
                  <div className='mx-2 flex h-8 w-8 items-center justify-center rounded border'>
                    {requirementInfo.isLock === 'l' ? (
                      // 요구사항이 lock 일 때
                      <Locked className='h-5 w-5 stroke-gray-400' />
                    ) : requirementInfo.isLock === 'u' &&
                      employeeId === requirementInfo.manager.employeeId ? (
                      // 요구사항이 unlock 이고 담당자일 때
                      <Unlocked
                        className='h-5 w-5 cursor-pointer stroke-gray-400 hover:stroke-gray-600'
                        onClick={handleLockButtonClick}
                      />
                    ) : (
                      // 요구사항이 unlock 이고 담당자가 아닐 때
                      <Unlocked className='h-5 w-5 stroke-gray-400' />
                    )}
                  </div>
                  {/* 스레드 열기 버튼 */}
                  <div
                    className='flex h-8 w-8 items-center justify-center rounded border'
                    onClick={handleToggleThreads}>
                    <PanelOpen className='h-6 w-6 cursor-pointer stroke-gray-400 stroke-1 hover:stroke-gray-600' />
                  </div>
                </div>

                {/* 타이틀 컨테이너 */}
                <div className='flex w-full items-baseline'>
                  <div className='flex h-full items-end'>
                    <p className='border-r-2 pr-3 text-xl font-normal'>
                      {requirementInfo.code}
                    </p>
                    <p className='mx-3 text-2xl font-normal'>
                      {requirementInfo.requirementName}
                    </p>
                    <div className='rounded-full bg-gray-100 px-2 text-sm'>
                      {requirementInfo.version}
                    </div>
                  </div>
                </div>

                {/* 추가 정보 컨테이너 */}
                <div className='w-full border-b py-3'>
                  <div className='mb-3 flex items-center'>
                    {getApprovalText(requirementInfo.approval)}
                    <p className='ml-3'>{requirementInfo.approvalComment}</p>
                  </div>

                  <div className='flex flex-col px-3'>
                    <p>
                      작성자 | {requirementInfo.author.name} (
                      {requirementInfo.author.department}{' '}
                      {requirementInfo.author.position})
                    </p>
                    <p className='my-2'>
                      담당자 | {requirementInfo.manager.name} (
                      {requirementInfo.manager.department}{' '}
                      {requirementInfo.manager.position})
                    </p>
                    <div className='flex shrink-0 items-center'>
                      <p>작성일 | </p>
                      <p className='ml-1 mr-2'>
                        {extractDate(requirementInfo.createdAt)}
                      </p>
                      <p>{extractTime(requirementInfo.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* 요구사항 디테일 컨테이너 */}
                <div className='flex w-full flex-col py-3'>
                  {/* 요구사항 디테일 리스트 */}
                  <ul>
                    {requirementInfo.details.map((detail) => (
                      <div
                        className='group my-3 flex w-full items-center justify-between'
                        key={detail.requirementDetailId}>
                        <li
                          className={`w-full rounded border px-4 py-3 hover:border-gray-500 ${selectedDetailId === detail.requirementDetailId ? 'border-gray-500' : ''}`}
                          onClick={() =>
                            handleDetailClick(detail.requirementDetailId)
                          }>
                          <p
                            className={`text-lg ${detail.status === 'd' ? 'text-gray-300 line-through' : ''}`}>
                            {detail.content}
                          </p>
                        </li>
                        {/* 드롭다운 - 스레드생성, 요구사항 항목 수정 */}
                        {requirementInfo.isLock === 'u' && (
                          <div className='relative p-2'>
                            <div
                              className='flex items-center justify-center opacity-0 group-hover:opacity-100'
                              onClick={() => {
                                toggleDropdown(detail.requirementDetailId);
                              }}>
                              <Ellipsis
                                className={`h-6 w-6  ${openDropdownId === detail.requirementDetailId ? 'stroke-gray-700' : ' stroke-gray-400 hover:stroke-gray-700'}`}
                              />
                            </div>
                            {/* 드롭다운 컨테이너 */}
                            {openDropdownId === detail.requirementDetailId && (
                              <div className='fixed z-30 m-2 bg-white p-2 shadow'>
                                {/* 스레드 생성 */}
                                {!checkThreadExist(
                                  detail.requirementDetailId,
                                ) && (
                                  <div
                                    className='flex items-center hover:bg-gray-50'
                                    onClick={() => {
                                      handleChatClick(
                                        detail.requirementDetailId,
                                      );
                                    }}>
                                    <div className='flex h-8 w-8 items-center justify-center'>
                                      <ChatBubble className='h-5 w-5 cursor-pointer stroke-gray-400 stroke-1 group-hover:stroke-gray-600' />
                                    </div>
                                    <p className='mr-2 cursor-pointer group-hover:font-normal'>
                                      스레드 생성
                                    </p>
                                  </div>
                                )}
                                <div
                                  className='flex items-center hover:bg-gray-50'
                                  onClick={toggleDetailStatus(
                                    detail.requirementDetailId,
                                    detail.status,
                                  )}>
                                  <div className='flex h-8 w-8 items-center justify-center'>
                                    <Pencil className='h-5 w-5 cursor-pointer stroke-gray-400 stroke-1 group-hover:stroke-gray-600' />
                                  </div>
                                  <p className='mr-2 cursor-pointer group-hover:font-normal'>
                                    {detail.status === 'd'
                                      ? '활성화'
                                      : '비활성화'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                  {requirementInfo.isLock === 'u' && (
                    <div className='flex w-full items-center justify-between'>
                      <input
                        type='text'
                        placeholder='요구사항 항목 추가하기'
                        className='h-14 w-full rounded border px-4 py-3 hover:border-gray-500'
                        value={inputDetail}
                        onChange={(e) => setInputDetail(e.target.value)}
                      />
                      <button
                        className='ml-2 flex h-8 w-8 items-center justify-center text-nowrap rounded bg-pubble p-1 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
                        onClick={handlePlusClick}>
                        <Plus />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {/* 스레드 */}
          <div
            className={`flex flex-col overflow-y-auto transition duration-500 ${hasThreads && isThreadsOpen ? 'min-w-[30vw] max-w-[40vw] px-10 py-6 opacity-100' : 'max-w-0 overflow-hidden opacity-0'}`}>
            {threadList.map((threadInfo) => (
              <Thread
                key={threadInfo.detailId}
                data={threadInfo.userThreadDtos}
                selected={selectedDetailId === threadInfo.detailId}
                isActive={activeThreadId === threadInfo.detailId}
                setActiveThreadId={setActiveThreadId}
                updateCommentList={updateCommentList}
                isRequirementLocked={requirementInfo?.isLock === 'l'}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequirementPage;
