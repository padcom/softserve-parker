const dayOfWeek = require('../dayOfWeek')

module.exports = function isWeekendDay (date) {
  return [ 5, 6 ].includes(dayOfWeek(date))
}
