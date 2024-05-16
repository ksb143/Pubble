import { renderDate } from '@/utils/tiptap.ts';

interface VersionItemProps {
  title?: string;
  date: Date;
  isActive: boolean;
  onClick: () => void;
};

const VersionItem = ({ title, date, isActive, onClick }: VersionItemProps) => {
  return (
    <button onClick={onClick} className={`appearance-none bg-transparent flex grow shrink text-white text-left hover:bg-pubble ${isActive && 'bg-pubble'}`}>
      <span>{title || renderDate(date)}</span>
      {title ? <span>{renderDate(date)}</span> : null}
    </button>
  )
}

export default VersionItem