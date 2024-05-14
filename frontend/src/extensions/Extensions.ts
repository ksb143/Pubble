import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { ResizableImageExtension } from '@/extensions/ResizableImageExtension.ts';
import { ExtendedImageExtension } from '@/extensions/ExtendedImageExtension.ts';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import UniqueID from '@tiptap-pro/extension-unique-id';
import { v4 as uuidv4 } from 'uuid';

const lowlight = createLowlight(common);

export const extensions = [
  StarterKit,
  Dropcursor,
  Underline,
  Link.configure({
    HTMLAttributes: {
      class: 'underline text-pubble cursor-pointer hover:text-blue-700',
    },
  }),
  ResizableImageExtension,
  ExtendedImageExtension,
  Table.configure({
    resizable: true,
  }),
  TableCell,
  TableHeader,
  TableRow,
  CodeBlockLowlight.configure({
    lowlight,
    languageClassPrefix: 'language-',
    defaultLanguage: 'plaintext',
    HTMLAttributes: {
      class: 'bg-code-bg text-code-text py-4 p-4 rounded-md',
    },
  }),
  Color,
  TextStyle,
  Highlight.configure({
    HTMLAttributes: {
      style: 'background-color',
    },
    multicolor: true,
  }),
  UniqueID.configure({
    attributeName: 'id',
    types: [
      'paragraph',
      'heading',
      'blockquote',
      'codeBlock',
      'table',
      'image',
      'horizontalRule',
      'embed',
      'link',
    ],
    generateID: () => uuidv4(),
  }),
];
