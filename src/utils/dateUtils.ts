// Reference baseline date matching the environment (September 27, 2026)
export const CURRENT_DATE_STRING = '2026-09-27';
export const CURRENT_DATE = new Date('2026-09-27T00:00:00');

export function getDaysRemaining(deadlineStr: string): number {
  const deadline = new Date(deadlineStr + 'T23:59:59');
  const now = CURRENT_DATE;
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isExpired(deadlineStr: string): boolean {
  return getDaysRemaining(deadlineStr) < 0;
}

export function isClosingSoon(deadlineStr: string): boolean {
  const days = getDaysRemaining(deadlineStr);
  return days >= 0 && days <= 7;
}

export function isThisWeek(deadlineStr: string): boolean {
  const days = getDaysRemaining(deadlineStr);
  return days >= 0 && days <= 7;
}

export function isThisMonth(deadlineStr: string): boolean {
  const days = getDaysRemaining(deadlineStr);
  return days >= 0 && days <= 35;
}

export function formatDeadline(deadlineStr: string): string {
  try {
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    
    const days = getDaysRemaining(deadlineStr);
    if (days < 0) {
      return `${formatted} (Expired)`;
    } else if (days === 0) {
      return `${formatted} (Today!)`;
    } else if (days === 1) {
      return `${formatted} (Tomorrow)`;
    } else if (days <= 7) {
      return `${formatted} (in ${days} days)`;
    }
    return formatted;
  } catch {
    return deadlineStr;
  }
}
