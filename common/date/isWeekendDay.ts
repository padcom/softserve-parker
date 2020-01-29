import dayOfWeek from './dayOfWeek'

export default function isWeekendDay (date: string) {
  return [ 5, 6 ].includes(dayOfWeek(date))
}
