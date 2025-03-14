export interface Timestamp {
  seconds: number;
  nanos: number;
}

/**
 * Date 또는 문자열을 받아서 protobuf Timestamp 객체({ seconds, nanos })로 변환합니다.
 * @param date Date 객체, 날짜 문자열 또는 null
 * @returns Timestamp 객체 또는 null
 */
export function toTimestamp(date: Date | string | null): Timestamp | null {
  if (!date) return null;
  const d = new Date(date);
  return {
    seconds: Math.floor(d.getTime() / 1000),
    nanos: (d.getTime() % 1000) * 1e6,
  };
}
