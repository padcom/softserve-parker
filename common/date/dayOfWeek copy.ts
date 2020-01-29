export default function dayOfWeek (date: string) {
  try {
    return new Date(date).getDay()
  } catch (e) {
    throw new Error('Invalid date format: ' + date)
  }
}
