// 1. react 관련
import { useState, useEffect, useRef } from 'react';
// 2. library
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import rasterizeHTML from 'rasterizehtml';
// 3. api
// 4. store
import useRichStore from '@/stores/richStore';
// 5. component
// 6. image 등 assets
import HTML5 from '@/assets/icons/html5-line.svg?react';
import CSS3 from '@/assets/icons/css3-line.svg?react';
import JS from '@/assets/icons/javascript-line.svg?react';

interface CodeEditorWithPreviewProps {
  isOpen: boolean;
  applyCodeCapture: (
    imageDataUrl: string,
    html: string,
    css: string,
    javascript: string,
  ) => void;
}

const CodeEditorWithPreview = ({
  isOpen,
  applyCodeCapture,
}: CodeEditorWithPreviewProps) => {
  const { setHtml, setCss, setJavascript, javascript, html, css } =
    useRichStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>('');

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);

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
        <head><style>${css}</style></head>
        <body>${html}<script>${javascript}</script></body>
      </html>
    `;
    setSrcDoc(sourceDoc);
  }, [html, css, javascript]);

  // html 반영 함수
  const handleHtmlChange = (value: string | undefined) => {
    if (value !== undefined) setHtml(value);
  };

  // css 반영 함수
  const handleCssChange = (value: string | undefined) => {
    if (value !== undefined) setCss(value);
  };

  // javascript 반영 함수
  const handleJsChange = (value: string | undefined) => {
    if (value !== undefined) setJavascript(value);
  };

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
      <head><style>${css}</style></head>
      <body>${html}<script>${javascript}</script></body>
    </html>
  `;
    const canvas = document.createElement('canvas');

    try {
      const canvasResult = await rasterizeHTML.drawHTML(sourceDoc, canvas, {
        executeJs: true,
        executeJsTimeout: 5000,
      });
      const svgDataUrl = (canvasResult.image as HTMLImageElement).src;
      const imageDataUrl = (await convertSvgToImage(svgDataUrl)) as string;
      applyCodeCapture(imageDataUrl, html, css, javascript);
    } catch (error) {
      console.error('Error rendering HTML to image:', error);
    }

    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className='z-10 flex flex-col items-center justify-center gap-5 rounded border-2 border-gray-200 bg-white p-4 shadow-custom'>
      <div className='flex gap-5'>
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
              height='300px'
              value={html}
              onChange={handleHtmlChange}
            />
          </TabsContent>
          <TabsContent key='css-content' value='css'>
            <Editor
              defaultLanguage='css'
              theme='vs-dark'
              height='300px'
              value={css}
              onChange={handleCssChange}
            />
          </TabsContent>
          <TabsContent key='js-content' value='javascript'>
            <Editor
              defaultLanguage='javascript'
              theme='vs-dark'
              height='300px'
              value={javascript}
              onChange={handleJsChange}
            />
          </TabsContent>
        </Tabs>
        <div className='w-1/2 rounded border-4 p-10'>
          <iframe
            srcDoc={srcDoc}
            title='preview'
            sandbox='allow-scripts allow-same-origin'
            style={{ width: '100%', border: 'none', height: '300px' }}
          />
        </div>
      </div>
      <button
        onClick={applyChanges}
        className='rounded bg-pubble px-10 py-2 text-white hover:bg-dpubble hover:shadow-custom hover:outline-4 hover:outline-gray-200'>
        적용
      </button>
    </dialog>
  );
};

export default CodeEditorWithPreview;
