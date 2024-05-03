// 1. react 관련
// 2. library
import { useCurrentEditor } from '@tiptap/react';
// 3. api
// 4. store
// 5. component
// 6. image 등 assets
import BoldIcon from '@/assets/icons/bold.svg?react';
import ItalicIcon from '@/assets/icons/italic.svg?react';
import UnderlineIcon from '@/assets/icons/underline.svg?react';
import StrikeIcon from '@/assets/icons/strikethrough.svg?react';
import PaletteIcon from '@/assets/icons/palette-line.svg?react';
import MarkPenIcon from '@/assets/icons/mark-pen-line.svg?react';
import FeedbackLineIcon from '@/assets/icons/feedback-line.svg?react';

const BubbleMenuBar = () => {
  const editor = useCurrentEditor();

  if (!editor) {
    return null;
  }
  return (
    <div>
      <button>
        <BoldIcon />
      </button>
      <button>
        <ItalicIcon />
      </button>
      <button>
        <UnderlineIcon />
      </button>
      <button>
        <StrikeIcon />
      </button>
      <button>
        <PaletteIcon />
      </button>
      <button>
        <MarkPenIcon />
      </button>
      <button>
        <FeedbackLineIcon />
      </button>
    </div>
  );
};

export default BubbleMenuBar;
