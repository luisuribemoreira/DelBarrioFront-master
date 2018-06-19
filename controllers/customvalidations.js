function isDate (value) {
  if (isNaN(Date.parse(value))) {
    return false
  } else {
    return true
  }
}

function isDefined (value) {
  if (value) {
    return true
  } else {
    return false
  }
}

function isOffer (before, after) {
  if (before > after) {
    return true
  } else {
    return false
  }
}

function inicio (fecha) {
  var f = new Date()
  var dd = f.getDate()
  var mm = f.getMonth()
  var yyyy = f.getFullYear()

  var diaInput = fecha.getDate()
  var mesInput = fecha.getMonth()
  var anioInput = fecha.getFullYear()

  if (diaInput + mesInput + anioInput >= dd + mm + yyyy) {
    return true
  } else {
    return false
  }
}

function isDateAfter (before, after) {
  var ddb = before.getDate()
  var mmb = before.getMonth()
  var yyyyb = before.getFullYear()

  var dda = after.getDate()
  var mma = after.getMonth()
  var yyyya = after.getFullYear()

  if (ddb + mmb + yyyyb < dda + mma + yyyya) {
    return true
  } else { return false }
}

function isUnderAge (date) {
  if (isDate(date)) {
    let fechaActual = new Date()
    let fecha = new Date(date)
    if (fechaActual.getFullYear() - fecha.getFullYear() < 18) {
      return true
    } else if (fechaActual.getFullYear() - fecha.getFullYear() === 18 && fechaActual.getMonth() < fecha.getMonth()) {
      return true
    } else if (fechaActual.getFullYear() - fecha.getFullYear() === 18 && fechaActual.getMonth() === fecha.getMonth() && fechaActual.getDate() < fecha.getDate()) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

export default {
  isDate,
  isDefined,
  isOffer,
  inicio,
  isDateAfter,
  isUnderAge
}
