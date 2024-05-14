import { create } from 'zustand';

type RichModalStore = {
  isCodeModalOpen: boolean;
  isLinkModalOpen: boolean;
  isImageModalOpen: boolean;
  isFileModalOpen: boolean;
  link: string;
  html: string;
  css: string;
  javascript: string;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJavascript: (javascript: string) => void;
  openCodePreviewModal: (html: string, css: string, javascript: string) => void;
  closeCodePreviewModal: () => void;
  openLinkModal: () => void;
  closeLinkModal: () => void;
  openImageModal: () => void;
  closeImageModal: () => void;
  openFileModal: () => void;
  closeFileModal: () => void;
};

const useRichModalStore = create<RichModalStore>((set) => ({
  isCodeModalOpen: false,
  isLinkModalOpen: false,
  isImageModalOpen: false,
  isFileModalOpen: false,
  link: 'link',
  html: '',
  css: '',
  javascript: '',

  // 코드 모달 설정 함수
  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJavascript: (javascript) => set({ javascript }),
  openCodePreviewModal: (html, css, javascript) =>
    set({
      isCodeModalOpen: true,
      html,
      css,
      javascript,
    }),
  closeCodePreviewModal: () =>
    set({
      isCodeModalOpen: false,
    }),

  // 링크 모달 설정 함수
  openLinkModal: () => set({ isLinkModalOpen: true }),
  closeLinkModal: () => set({ isLinkModalOpen: false }),

  // 이미지 모달 설정 함수
  openImageModal: () => set({ isImageModalOpen: true }),
  closeImageModal: () => set({ isImageModalOpen: false }),

  // 파일 모달 설정 함수
  openFileModal: () => set({ isFileModalOpen: true }),
  closeFileModal: () => set({ isFileModalOpen: false }),
}));

export default useRichModalStore;
