export default function dayOfMonth (date: string) {
  try {
    return parseInt(date.split('-')[2])
  } catch (e) {
    throw new Error('Invalid date format: ' + date)
  }
}
