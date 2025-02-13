import { Event, RepeatInfo } from '../types.ts';

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const sunday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month + 1);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];

  const initWeek = () => Array(7).fill(null);

  let week: Array<number | null> = initWeek();

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = initWeek();
    }
  }

  return weeks;
}

export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

export function formatWeek(targetDate: Date) {
  const dayOfWeek = targetDate.getDay();
  const diffToThursday = 4 - dayOfWeek;
  const thursday = new Date(targetDate);
  thursday.setDate(targetDate.getDate() + diffToThursday);

  const year = thursday.getFullYear();
  const month = thursday.getMonth() + 1;

  const firstDayOfMonth = new Date(thursday.getFullYear(), thursday.getMonth(), 1);

  const firstThursday = new Date(firstDayOfMonth);
  firstThursday.setDate(1 + ((4 - firstDayOfMonth.getDay() + 7) % 7));

  const weekNumber: number =
    Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  const normalizedDate = stripTime(date);
  const normalizedStart = stripTime(rangeStart);
  const normalizedEnd = stripTime(rangeEnd);

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
}

export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join('-');
}

// daily, weekly, monthly, yearly 반복일정 생성기
export function getRepeatDates({ type, interval, endDate }: RepeatInfo, startDate: Date) {
  const startDateString = startDate.toISOString().split('T')[0];
  const repeatDates = [startDateString];

  if (type === 'none' || !endDate) {
    // 편의상 종료일 지정 없으면 그냥 시작일만 반환
    return repeatDates;
  }
  let deadLine = new Date(endDate);
  let nextDate = new Date(startDate);
  let stillContinue = true;
  const is월말 =
    getDaysInMonth(nextDate.getFullYear(), startDate.getMonth() + 1) === startDate.getDate()
      ? true
      : false;

  while (stillContinue) {
    if (type === 'daily') {
      nextDate.setDate(nextDate.getDate() + interval);
    } else if (type === 'weekly') {
      nextDate.setDate(nextDate.getDate() + interval * 7);
    } else if (type === 'monthly') {
      const 다음월 = nextDate.getMonth() + interval;
      if (is월말) {
        const 월말일자 = getDaysInMonth(nextDate.getFullYear(), 다음월 + 1);
        nextDate.setMonth(다음월);
        nextDate.setDate(월말일자);
      }
      nextDate.setMonth(다음월);
    } else if (type === 'yearly') {
      nextDate.setFullYear(nextDate.getFullYear() + interval);
    }

    if (nextDate <= deadLine) {
      repeatDates.push(nextDate.toISOString().split('T')[0]);
    } else {
      stillContinue = false;
    }
  }
  return repeatDates;
}
