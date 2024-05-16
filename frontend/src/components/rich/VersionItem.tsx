import { renderDate } from '@/utils/tiptap.ts';

interface VersionItemProps {
  title?: string;
  date: Date;
  isActive: boolean;
  onClick: () => void;
}

const VersionItem = ({ title, date, isActive, onClick }: VersionItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`mt-3 flex shrink grow appearance-none bg-transparent text-left text-black hover:bg-gray-200 ${isActive && 'bg-pubble'}`}>
      <span className='mr-3'>{title || renderDate(date)}</span>
      {title ? <span>{renderDate(date)}</span> : null}
    </button>
  );
};

export default VersionItem;
