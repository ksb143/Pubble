import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 페이지 정보를 저장하기 위한 인터페이스 정의
interface pageInfoStore {
  projectId: number;
  projectCode: string;
  projectName: string;
  requirementId: number;
  requirementCode: string;
  requirementName: string;
  isRichPage: boolean;
  setProjectId: (projectId: number) => void;
  setProjectCode: (projectCode: string) => void;
  setProjectName: (projectName: string) => void;
  setRequirementId: (requirementId: number) => void;
  setRequirementCode: (requirementCode: string) => void;
  setRequirementName: (requirementName: string) => void;
  setIsRichPage: (isRichPage: boolean) => void;
}

const usePageInfoStore = create(
  persist<pageInfoStore>(
    (set) => ({
      projectId: 0,
      projectCode: '',
      projectName: '',
      requirementId: 0,
      requirementCode: '',
      requirementName: '',
      isRichPage: false,
      setProjectId: (projectId) => set({ projectId }),
      setProjectCode: (projectCode) => set({ projectCode }),
      setProjectName: (projectName) => set({ projectName }),
      setRequirementId: (requirementId) => set({ requirementId }),
      setRequirementCode: (requirementCode) => set({ requirementCode }),
      setRequirementName: (requirementName) => set({ requirementName }),
      setIsRichPage: (isRichPage) => set({ isRichPage }),
    }),
    {
      name: 'pageInfoStore', // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), // 세션 저장소 사용
    },
  ),
);


export default usePageInfoStore;
