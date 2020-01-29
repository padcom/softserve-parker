const dayOfWeek = require('../dayOfWeek')

module.exports = function isWeekendDay (date) {
  return [ 0, 6 ].includes(dayOfWeek(date))
}
