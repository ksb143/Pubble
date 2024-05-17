// LocalDateTime 문자열에서 YYYY-MM-DD 형식으로 날짜 부분 추출
export const extractDate = (localDateTime: string) => {
  return localDateTime.split('T')[0];
};

// LocalDateTime 문자열에서 HH:MM 형식으로 시간 부분 추출
export const extractTime = (localDateTime: string) => {
  return localDateTime.split('T')[1].slice(0, 5);
};
