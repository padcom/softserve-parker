module.exports = function dayOfWeek (date) {
  try {
    return new Date(date).getDay()
  } catch (e) {
    throw new Error('Invalid date format: ' + date)
  }
}
