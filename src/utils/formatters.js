/**
 * 날짜를 "yyyy-MM-dd hh:mm:ss" 형식으로 포맷
 * @param {string|Date} dateString - 날짜 문자열 또는 Date 객체
 * @returns {string} 포맷된 날짜 문자열
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 숫자를 k 단위로 포맷
 * - 1,000 이상 10,000 미만: 소수점 1자리 + k (예: 1.5k)
 * - 10,000 이상: 정수 + k (예: 15k)
 * @param {number} count - 포맷할 숫자
 * @returns {string} 포맷된 숫자 문자열
 */
export function formatCount(count) {
  if (count >= 100000) {
    return Math.floor(count / 1000) + 'k';
  } else if (count >= 10000) {
    return Math.floor(count / 1000) + 'k';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 * @param {string} text - 자를 텍스트
 * @param {number} maxLength - 최대 길이 (기본값: 26)
 * @returns {string} 잘린 텍스트
 */
export function truncateText(text, maxLength = 26) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}
