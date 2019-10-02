export class DateValidator {
  static assertDatesIsntInThePast(dates: Date[]): void | Error {
    const today = new Date()
    today.setHours(0,0,0,0)
    dates.forEach((date: Date) => {
      if (date.getTime() < today.getTime()) {
        throw new Error(`Provided date is in the past. ${date}`)
      }
    })
  }

  static assertDoesntContainsDuplicates(dates: Date[]): void | Error {
    const distinct = dates
      .map((date: Date) => date.getTime())
      .filter((value: number, i: number, self: number[]) => self.indexOf(value) === i)
    if (distinct.length !== dates.length) throw new Error('Provided date range contains duplicates.')
  }
}