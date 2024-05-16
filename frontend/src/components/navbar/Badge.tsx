// 배지 크기 타입 정의
interface BadgeProps {
  size: 'sm' | 'md' | 'lg';
  position: 'left' | 'right';
}

const Badge: React.FC<BadgeProps> = ({ size, position }) => {
  // 배지 크기 스타일 정의
  const sizeStyles = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  // 배지 위치 스타일 정의
  const positionStyles = {
    left: '-left-1 top-4',
    right: 'right-1 top-1',
  };

  // tailwind 클래스 설정 및 초기값 설정
  const sizeClass = sizeStyles[size] || 'h-3 w-3';
  const positionClass = positionStyles[position] || 'right-0 top-0';

  return (
    <div className={`absolute ${positionClass}`}>
      <span className={`relative flex ${sizeClass}`}>
        <span className='absolute inline-flex h-full w-full animate-badge-ping rounded-full bg-red-400 opacity-75'></span>
        <span
          className={`relative inline-flex rounded-full bg-red-500  ${sizeClass}`}></span>
      </span>
    </div>
  );
};

export default Badge;
