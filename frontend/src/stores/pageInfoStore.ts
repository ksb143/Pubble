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
            set({
              ...initialState,
              projectId: args.projectId ?? initialState.projectId,
              projectCode: args.projectCode ?? initialState.projectCode,
              projectName: args.projectName ?? initialState.projectName,
            });
            break;
          case 'requirement':
            set((state) => ({
              ...state,
              requirementId: args.requirementId ?? initialState.requirementId,
              requirementCode:
                args.requirementCode ?? initialState.requirementCode,
              requirementName:
                args.requirementName ?? initialState.requirementName,
              isRichPage: initialState.isRichPage,
            }));
            break;
          case 'rich':
            set((state) => ({
              ...state,
              isRichPage: args.isRichPage ?? initialState.isRichPage,
            }));
            break;
          case 'init':
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
