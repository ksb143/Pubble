// 1. react 관련
import { useRef, useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
// 3. api
// 4. store
// 5. component
import Grid from '@/components/rich/Grid';
// 6. image 등 assets
import SearchIcon from '@/assets/icons/search.svg?react';
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
  projectName: string;
  requirementCode: string;
  requirementName: string;
  openCodeEditorWithPreviewModal: () => void;
  openImageModal: () => void;
  openFileModal: () => void;
  openLinkModal: () => void;
}

const MenuBar = ({
  editor,
  projectName,
  requirementCode,
  requirementName,
  openCodeEditorWithPreviewModal,
  openImageModal,
  openFileModal,
  openLinkModal,
}: MenuBarProps) => {
  const [row, setRow] = useState<number>(3);
  const [col, setCol] = useState<number>(3);
  const rowInput = useRef(null);
  const colInput = useRef(null);
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setRow(rowIndex);
    setCol(colIndex);
  };

  return (
    <div className='relative flex w-full items-center justify-around rounded-t-sm bg-[#e5e6e6] py-2 text-black'>
      <div className='flex gap-2'>
        <span className='h-4 w-4 rounded-full bg-[#fd5a57]'></span>
        <span className='h-4 w-4 rounded-full bg-[#fdbe3c]'></span>
        <span className='h-4 w-4 rounded-full bg-[#13c43f]'></span>
      </div>
      <div className='flex items-center justify-between gap-5 rounded-lg bg-[#fefefe] px-4 py-1'>
        <SearchIcon />
        <div className='flex items-center gap-3'>
          <h1 className='text-lg font-normal'>ID {requirementCode}</h1>
          <h1 className='text-lg font-normal'>{requirementName}</h1>
          <h2>{projectName}</h2>
        </div>
      </div>
      <div className='flex'>
        <div className='flex gap-8'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}>
              <BoldIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}>
              <ItalicIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}>
              <UnderlineIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}>
              <StrikeIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <label className='flex w-8 cursor-pointer items-end'>
              <PaletteIcon className='h-6 w-6 fill-gray-800' />
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
              <MarkPenIcon className='h-6 w-6 fill-gray-800' />
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
            <button onClick={openImageModal}>
              <ImageLineIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <button onClick={openFileModal}>
              <FileLineIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <button onClick={openLinkModal}>
              <LinkIcon className='h-6 w-6 fill-gray-800' />
            </button>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <CodeBlockIcon className='h-6 w-6 fill-gray-800' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className='flex items-center'>
                    <CodeVIewIcon className='h-5 w-5 fill-gray-800' />
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
                  onClick={openCodeEditorWithPreviewModal}
                  className='flex items-center'>
                  <CodeVIewIcon className='h-5 w-5 fill-gray-800' />
                  <span className='ml-2'>HTML블럭</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <button>
                  <TableLIneIcon className='h-6 w-6 fill-gray-800' />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <p className='mb-3'>
                  <span>표 삽입 </span>
                  <span className='text-pubble'>{col}</span>
                  <span className='text-pubble'> X </span>
                  <span className='text-pubble'>{row}</span>
                </p>
                <div className='mb-3'>
                  <Grid rows={row} cols={col} onCellClick={handleCellClick} />
                </div>
                <div className='mb-3 flex items-center justify-center'>
                  <span className='w-1/4'>열 개수</span>
                  <input
                    ref={colInput}
                    value={col}
                    type='number'
                    className='w-3/4 rounded border-2 border-gray-200 px-2 focus:outline-none'
                    onChange={(event) => {
                      setCol(parseInt(event.target.value, 10));
                    }}
                  />
                </div>
                <div className='mb-3 flex items-center justify-center'>
                  <span className='w-1/4'>행 개수</span>
                  <input
                    ref={rowInput}
                    value={row}
                    type='number'
                    className='w-3/4 rounded border-2 border-gray-200 px-2 focus:outline-none'
                    onChange={(event) => {
                      setRow(parseInt(event.target.value, 10));
                    }}
                  />
                </div>
                <div className='flex justify-end'>
                  <button
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({
                          rows: row,
                          cols: col,
                          withHeaderRow: true,
                        })
                        .run()
                    }
                    className='text-pubble'>
                    적용
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
