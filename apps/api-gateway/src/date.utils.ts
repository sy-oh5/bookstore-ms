export interface Timestamp {
  seconds: number;
  nanos: number;
}

/**
 * Timestamp 객체를 JavaScript Date 객체로 변환합니다.
 * @param timestamp Timestamp 객체
 * @returns Date 객체
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return new Date(timestamp.seconds * 1000 + timestamp.nanos / 1e6);
}
