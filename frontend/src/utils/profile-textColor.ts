// 색상의 밝기 계산 함수
export const getLuminance = (colorHex: string): number => {
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// 배경색 밝기에 따라 텍스트 색상을 반환하는 함수
export const getTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  // 배경색이 밝으면 검은색 텍스트, 아니면 흰색 텍스트를 반환
  return luminance > 186 ? '#000000' : '#ffffff';
};
