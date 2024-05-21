import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 페이지 타입 정의
interface PageInfo {
  projectId: number;
  projectCode: string;
  projectName: string;
  requirementId: number;
  requirementCode: string;
  requirementName: string;
  isRichPage: boolean;
}

// 스토어 상태 및 액션 타입 정의
interface PageInfoStore extends PageInfo {
  setPageType: (
    type: 'project' | 'requirement' | 'rich' | 'init',
    args?: Partial<PageInfo>,
  ) => void;
}

// 초기 상태
const initialState: PageInfo = {
  projectId: 0,
  projectCode: '',
  projectName: '',
  requirementId: 0,
  requirementCode: '',
  requirementName: '',
  isRichPage: false,
};

// 스토어 생성
const usePageInfoStore = create(
  persist<PageInfoStore>(
    (set) => ({
      ...initialState,

      // 입력받은 페이지 타입에 따라 상태 변경
      setPageType: (type, args = {}) => {
        switch (type) {
          case 'project':
            // project 페이지의 초기 렌더링 세팅 or
            // project 관련 변수 세팅, 입력받은 값이 있으면 변경
            set({
              ...initialState, // 나머지 변수는 초기값으로 설정
              projectId: args.projectId ?? initialState.projectId,
              projectCode: args.projectCode ?? initialState.projectCode,
              projectName: args.projectName ?? initialState.projectName,
            });
            break;

          case 'requirement':
            // requirement 페이지의 초기 렌더링 세팅 or
            // requirement 관련 변수 세팅, 입력받은 값이 있으면 변경
            set((state) => ({
              ...state, // 프로젝트 관련 변수는 기존 값 유지
              requirementId: args.requirementId ?? initialState.requirementId,
              requirementCode:
                args.requirementCode ?? initialState.requirementCode,
              requirementName:
                args.requirementName ?? initialState.requirementName,
              isRichPage: initialState.isRichPage,
            }));
            break;

          case 'rich':
            // rich 페이지의 초기 렌더링 세팅 or
            // rich 관련 변수 중 입력받은 값이 있으면 변경
            set((state) => ({
              ...state, // 나머지 변수는 기존 값 유지
              isRichPage: args.isRichPage ?? initialState.isRichPage,
            }));
            break;

          case 'init':
            // 모든 변수를 초기값으로 설정
            set(initialState);
            break;
        }
      },
    }),
    {
      name: 'pageInfoStore', // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), // 세션 저장소 사용
    },
  ),
);

export default usePageInfoStore;
