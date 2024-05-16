// 1. react 관련
import { useState, useEffect, useRef, useCallback } from 'react';
// 2. library
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import rasterizeHTML from 'rasterizehtml';
import * as Dialog from '@radix-ui/react-dialog';
// 3. api
import { getImageUrl } from '@/apis/rich.ts';
// 4. store
// 5. component
// 6. image 등 assets
import HTML5 from '@/assets/icons/html5-line.svg?react';
import CSS3 from '@/assets/icons/css3-line.svg?react';
import JS from '@/assets/icons/javascript-line.svg?react';

interface CodePreview {
  html: string;
  css: string;
  javascript: string;
}

interface CodeEditorWithPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  applyCodeCapture: (
    imageDataUrl: string,
    html: string,
    css: string,
    javascript: string,
  ) => void;
  requirementId: number;
  codePreview: CodePreview;
}

const CodeEditorWithPreview = ({
  isOpen,
  onClose,
  applyCodeCapture,
  requirementId,
  codePreview,
}: CodeEditorWithPreviewProps) => {
  const { html, css, javascript } = codePreview;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>('');
  const [htmlValue, setHtmlValue] = useState<string>(html);
  const [cssValue, setCssValue] = useState<string>(css);
  const [jsValue, setJsValue] = useState<string>(javascript);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', applyChanges);
      return () => iframe.removeEventListener('load', applyChanges);
    }
  }, [srcDoc]); // Dependency array ensures this only reruns if srcDoc changes

  useEffect(() => {
    const sourceDoc = `
      <html>
        <head><style>${cssValue}</style></head>
        <body>${htmlValue}<script>${jsValue}</script></body>
      </html>
    `;
    setSrcDoc(sourceDoc);
  }, [htmlValue, cssValue, jsValue]);

  // 오픈 변경 함수
  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // SVG 이미지 데이터 URL을 받아 Canvas 그리고 URL 변환 함수
  const convertSvgToImage = (svgDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('2D context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0);

        const imageDataUrl = canvas.toDataURL('image/png');
        resolve(imageDataUrl);
      };

      img.onerror = reject;
      img.src = svgDataUrl;
    });
  };

  // 코드 변경사항 이미지 url 만들고 적용하는 함수
  const applyChanges = async () => {
    const sourceDoc = `
    <html>
      <head><style>${cssValue}</style></head>
      <body>${htmlValue}<script>${jsValue}</script></body>
    </html>
  `;
    const canvas = document.createElement('canvas');

    try {
      const canvasResult = await rasterizeHTML.drawHTML(sourceDoc, canvas, {
        executeJs: true,
        executeJsTimeout: 1000,
      });
      const svgDataUrl = (canvasResult.image as HTMLImageElement).src;
      const imageDataUrl = (await convertSvgToImage(svgDataUrl)) as string;

      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const imageFile = new File([blob], 'code-image.png', { type: blob.type });

      const uploadedImageUrl = await getImageUrl(imageFile, requirementId);

      applyCodeCapture(uploadedImageUrl, htmlValue, cssValue, jsValue);
      onClose();
    } catch (error) {
      console.error('Error rendering HTML to image:', error);
      alert('코드 미리보기 이미지 생성에 실패했습니다.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed left-0 top-0 z-10 h-full w-full opacity-100'>
          <Dialog.Content className='fixed left-1/2 top-1/2 z-20 flex h-2/3 w-3/4 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-3 rounded bg-white p-6 shadow-custom'>
            <div className='flex gap-3'>
              <Tabs className='w-1/2' defaultValue='html'>
                <TabsList>
                  <TabsTrigger key='html' className='w-24' value='html'>
                    <HTML5 className='h-5 w-5 fill-red-600 stroke-1' />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger key='css' className='w-24' value='css'>
                    <CSS3 className='h-5 w-5 fill-pubble stroke-1' />
                    CSS
                  </TabsTrigger>
                  <TabsTrigger key='js' className='w-24' value='javascript'>
                    <JS className='h-5 w-5 fill-yellow-600 stroke-1' />
                    JS
                  </TabsTrigger>
                </TabsList>
                <TabsContent key='html-content' value='html'>
                  <Editor
                    defaultLanguage='xml'
                    theme='vs-dark'
                    height='250px'
                    value={html}
                    onChange={(value) => setHtmlValue(value || '')}
                  />
                </TabsContent>
                <TabsContent key='css-content' value='css'>
                  <Editor
                    defaultLanguage='css'
                    theme='vs-dark'
                    height='250px'
                    value={css}
                    onChange={(value) => setCssValue(value || '')}
                  />
                </TabsContent>
                <TabsContent key='js-content' value='javascript'>
                  <Editor
                    defaultLanguage='javascript'
                    theme='vs-dark'
                    height='250px'
                    value={javascript}
                    onChange={(value) => setJsValue(value || '')}
                  />
                </TabsContent>
              </Tabs>
              <div className='w-1/2 rounded border-4 p-10'>
                <iframe
                  srcDoc={srcDoc}
                  title='preview'
                  sandbox='allow-scripts allow-same-origin'
                  style={{ width: '100%', border: 'none', height: '250px' }}
                />
              </div>
            </div>
            <div className='w-1/3 '>
              <button
                onClick={applyChanges}
                className='rounded bg-pubble px-10 py-2 text-white hover:bg-dpubble hover:shadow-custom hover:outline-4 hover:outline-gray-200'>
                적용
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CodeEditorWithPreview;
