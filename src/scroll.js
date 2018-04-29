
const $ = require('./core')

// Scroll to the first matched element
$.prototype.scroll = function () {
  this.first().scrollIntoView({ behavior: 'smooth' })
  return this
}
