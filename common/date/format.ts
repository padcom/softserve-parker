export default function format (date: Date) {
  return date.toISOString().split('T')[0]
}
