module 'common' {
  module 'date' {
    module 'dayOfMonth' {
      declare function dayOfMonth (date: string): number
    }
    module 'dayOfWeek' {
      declare function dayOfWeek (date: string): number
    }
    module 'addDays' {
      declare function addDays (date: string, numberOfDaysToAdd: number): string
    }
    module 'isWeekendDay' {
      declare function isWeekendDay (date: string): boolean
    }
    module 'format' {
      declare function format (date: Date): string
    }
  }
}

