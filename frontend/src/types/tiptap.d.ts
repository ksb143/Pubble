import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertIframe: {
      insertIframe: (options: IframeAttrs) => ReturnType;
    };
  }
}
