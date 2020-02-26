export function isTimeQuery(query: string): boolean {
  return query === 'query { today, deadline, cancelHour }'
}
