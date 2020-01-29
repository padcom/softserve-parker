export default function format (date: Date) {
  try {
    return date.toISOString().split('T')[0]
  } catch (e) {
    throw new Error('Invalid date format: ' + date)
  }
}
