const MILISECONDS_IN_A_DAY = 86400000

export default function addDays (date: string, numberOfDaysToAdd: number) {
  try {
    const newDate = new Date(new Date(date).getTime() + numberOfDaysToAdd * MILISECONDS_IN_A_DAY)
    return newDate.toISOString().split('T')[0]
  } catch (e) {
    throw new Error('Invalid date format: ' + date)
  }
}
