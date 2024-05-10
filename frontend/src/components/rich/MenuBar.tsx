// 1. react 관련
// 2. library
import { Editor } from '@tiptap/react';
import styled from '@emotion/styled';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
// 3. api
// 4. store
import useRichStore from '@/stores/richStore';
// 5. component
// 6. image 등 assets
import BoldIcon from '@/assets/icons/bold.svg?react';
import ItalicIcon from '@/assets/icons/italic.svg?react';
import UnderlineIcon from '@/assets/icons/underline.svg?react';
import StrikeIcon from '@/assets/icons/strikethrough.svg?react';
import PaletteIcon from '@/assets/icons/palette-line.svg?react';
import MarkPenIcon from '@/assets/icons/mark-pen-line.svg?react';
import ImageLineIcon from '@/assets/icons/image-line.svg?react';
import FileLineIcon from '@/assets/icons/file-line.svg?react';
import LinkIcon from '@/assets/icons/link.svg?react';
import CodeBlockIcon from '@/assets/icons/code-block.svg?react';
import TableLIneIcon from '@/assets/icons/table-line.svg?react';
import LinkUnlinkIcon from '@/assets/icons/link-unlink-m.svg?react';
import WindowLineIcon from '@/assets/icons/window-line.svg?react';
import CodeVIewIcon from '@/assets/icons/code-view.svg?react';

const codeLangType = [
  { label: 'Javascript', value: 'javascript' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
];

// 컬러팔레트 커스텀
const ColorInput = styled.input`
  width: 10px; // 너비 설정
  height: 14px; // 높이 설정
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;

  &::-webkit-color-swatch {
    border-radius: 50%;
    border: none;
  }
`;

// 하이라이트 커스텀
const HighlightInput = styled.input`
  width: 10px; // 너비 설정
  height: 14px; // 높이 설정
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;

  &::-webkit-color-swatch {
    border-radius: 50%;
    border: none;
  }
`;

interface MenuBarProps {
  editor: Editor;
  requirementId: string;
  requirementName: string;
  projectName: string;
  openImageUploadModal: () => void;
  openLinkUploadModal: (tabType: string) => void;
}

const MenuBar = ({
  editor,
  requirementId,
  requirementName,
  projectName,
  openImageUploadModal,
  openLinkUploadModal,
}: MenuBarProps) => {
  const { openCodePreviewModal  } = useRichStore();
  if (!editor) {
    return null;
  }

  return (
    <div className='flex w-full justify-around rounded py-2 shadow-custom'>
      <div className='flex items-end gap-3'>
        <h1 className='text-2xl font-normal'>ID {requirementId}</h1>
        <h1 className='text-2xl font-normal'>{requirementName}</h1>
        <h2>{projectName}</h2>
      </div>
      <div className='flex'>
        <div className='flex gap-8'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}>
              <BoldIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}>
              <ItalicIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}>
              <UnderlineIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}>
              <StrikeIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
            <label className='flex w-8 cursor-pointer items-end'>
              <PaletteIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
              <ColorInput
                type='color'
                onInput={(event) => {
                  const target = event.target as HTMLInputElement; // 타입 단언 추가
                  editor.chain().focus().setColor(target.value).run();
                }}
                value={editor.getAttributes('textStyle').color}
                data-testid='setColor'
              />
            </label>
            <label className='flex w-8 cursor-pointer items-end'>
              <MarkPenIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
              <HighlightInput
                type='color'
                onInput={(event) => {
                  const target = event.target as HTMLInputElement; // 타입 단언 추가
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: target.value })
                    .run();
                }}
                value={editor.getAttributes('textStyle').highlight}
                data-testid='setColor'
              />
            </label>
          </div>
          <div className='flex items-center gap-3'>
            <button onClick={openImageUploadModal}>
              <ImageLineIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
            <button>
              <FileLineIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <LinkIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openLinkUploadModal('link')}>
                  <LinkUnlinkIcon className='h-5 w-5 stroke-gray-900 stroke-0' />
                  <span className='ml-2'>링크</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openLinkUploadModal('webImage')}>
                  <WindowLineIcon className='h-5 w-5 stroke-gray-900 stroke-0' />
                  <span className='ml-2'>웹이미지</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <CodeBlockIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className='flex items-center'>
                    <CodeVIewIcon className='h-5 w-5 stroke-gray-900 stroke-0' />
                    <span className='ml-2'>언어 선택</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        editor.chain().focus().toggleCodeBlock().run();
                      }}>
                      Plain
                    </DropdownMenuItem>
                    {codeLangType.map((lang) => (
                      <DropdownMenuItem
                        key={lang.value}
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleCodeBlock({ language: lang.value })
                            .run()
                        }>
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onClick={() => {openCodePreviewModal("", "", "")}}
                  className='flex items-center'>
                  <CodeVIewIcon className='h-5 w-5 stroke-gray-900 stroke-0' />
                  <span className='ml-2'>HTML블럭</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button>
              <TableLIneIcon className='h-6 w-6 stroke-gray-900 stroke-0' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
