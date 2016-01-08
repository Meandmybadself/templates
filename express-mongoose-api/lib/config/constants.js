function createConstants() {
  let args = Array.prototype.slice.call(arguments);
  let constants = {}
  args.forEach((constant) => {
    if (Array.isArray(constant)) {
      let key = constant[0]
      let val = constant[1]
      constants[key] = val
    } else if (typeof constant === 'string') {
      constants[constant] = constant
    }
  })
  return constants
}

module.exports = createConstants(
  ['API_RES_STATUS_OK', 'OK'],
  ['API_RES_STATUS_ERR', 'ERR']
)
