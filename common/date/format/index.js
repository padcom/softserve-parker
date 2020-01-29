module.exports = function format (date) {
  return date.toISOString().split('T')[0]
}
