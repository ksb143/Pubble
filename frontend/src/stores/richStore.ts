import { create } from 'zustand';

type RichStore = {
  isCodeModalOpen: boolean;
  html: string;
  css: string;
  javascript: string;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJavascript: (javascript: string) => void;
  openCodePreviewModal: (html: string, css: string, javascript: string) => void;
  closeCodePreviewModal: () => void;
};

const useRichStore = create<RichStore>((set) => ({
  isCodeModalOpen: false,
  html: '',
  css: '',
  javascript: '',

  // 코드 설정 함수
  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJavascript: (javascript) => set({ javascript }),

  // 모달 열기 함수
  openCodePreviewModal: (html, css, javascript) => set({
    isCodeModalOpen: true,
    html,
    css,
    javascript
  }),

  // 모달 닫기 함수
  closeCodePreviewModal: () => set({
    isCodeModalOpen: false
  })
}));

export default useRichStore;