// 배지 크기 타입 정의
interface BadgeProps {
  size: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ size }) => {
  // 배지 크기 스타일 정의
  const sizeStyles = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  // tailwind 클래스 설정 및 기본 크기 설정
  const sizeClass = sizeStyles[size] || 'h-3 w-3';

  return (
    <div className='absolute -left-1 top-4'>
      <span className={`relative flex ${sizeClass}`}>
        <span className='animate-ping3 absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
        <span
          className={`relative inline-flex rounded-full bg-red-500  ${sizeClass}`}></span>
      </span>
    </div>
  );
};

export default Badge;
