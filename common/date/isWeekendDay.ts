import dayOfWeek from './dayOfWeek'

export default function isWeekendDay (date: string) {
  return [ 0, 6 ].includes(dayOfWeek(date))
}
