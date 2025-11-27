export function formatDate(dateValue: string | Date | number): string {
  const date =
    typeof dateValue === 'number'
      ? new Date(dateValue * 1000)
      : new Date(dateValue)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function formatCount(count: number | null | undefined): string {
  if (count == null || isNaN(count)) {
    return '0'
  }

  if (count >= 10000) {
    return Math.floor(count / 1000) + 'k'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

export function truncateText(text: string, maxLength: number = 26): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

export function formatDateDot(dateValue: string | Date): string {
  try {
    const date = new Date(dateValue)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  } catch {
    return typeof dateValue === 'string' ? dateValue : ''
  }
}

export function formatDateLong(dateValue: string | Date): string {
  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

export function parseCommaSeparatedList(text: string, fallback: string[] = []): string[] {
  if (!text || !text.trim()) {
    return fallback
  }
  return text
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}
