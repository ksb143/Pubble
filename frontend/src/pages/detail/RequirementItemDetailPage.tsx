// 1. react 관련
import { useState } from 'react';
import { useParams } from 'react-router-dom';
// 2. library
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import FileHandler from '@tiptap-pro/extension-file-handler';
import Lottie from 'react-lottie';
// 3. api
// 4. store
// 5. component
import MenuBar from '@/components/details/MenuBar.tsx';
import BubbleMenuBar from '@/components/details/BubbleMenuBar.tsx';
import ImageUploadModal from '@/components/details/ImageUploadModal.tsx';
// 6. image 등 assets
import LodingAnimation from '@/assets/lotties/loading.json';
import { ResizableImage } from '@/extensions/ResizableImage.ts';

const RequirementItemDetailPage = () => {
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  // 파라미터
  const { projectName = '', requirementId = '' } = useParams();

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LodingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 에디터 확장 기능
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      ResizableImage,
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TableHeader,
      TableRow,
      Color,
      TextStyle,
      Highlight.configure({
        HTMLAttributes: {
          style: 'background-color',
        },
        multicolor: true,
      }),
      FileHandler,
    ],
    content: '',
  });

  // 이미지 삽입 함수
  const handleImageInsert = (image: string) => {
    editor?.chain().focus().setResizableImage({ src: image, width: 300 }).run();
    setIsImageUploadModalOpen(false);
  };

  // 에디터가 없을 경우
  if (!editor) {
    return <Lottie options={defaultOptions} height={500} width={500} />;
  }

  // 에디터가 있을 경우
  return (
    <div className='mx-12 mt-10 grid grid-cols-12'>
      <div className='col-span-10 col-start-2'>
        <MenuBar
          editor={editor}
          requirementId={requirementId}
          requirementName='좋아요 기능'
          projectName={projectName}
          openImageUploadModal={() => setIsImageUploadModalOpen(true)}
        />
      </div>
      <div className='col-span-10 col-start-2 h-screen p-6 shadow'>
        <EditorContent editor={editor}></EditorContent>
        <BubbleMenu>
          <BubbleMenuBar />
        </BubbleMenu>
        <ImageUploadModal
          isOpen={isImageUploadModalOpen}
          onClose={() => setIsImageUploadModalOpen(false)}
          onInsert={handleImageInsert}
        />
      </div>
    </div>
  );
};

export default RequirementItemDetailPage;
