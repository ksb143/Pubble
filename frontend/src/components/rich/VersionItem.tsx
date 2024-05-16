import { renderDate } from '@/utils/tiptap.ts';

interface VersionItemProps {
  title?: string;
  date: number;
  isActive: boolean;
  onClick: () => void;
}

const VersionItem = ({ title, date, isActive, onClick }: VersionItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex shrink grow appearance-none bg-transparent text-left text-white hover:bg-pubble ${isActive && 'bg-pubble'}`}>
      <span>{title || renderDate(date)}</span>
      {title ? <span>{renderDate(date)}</span> : null}
    </button>
  );
};

export default VersionItem;
