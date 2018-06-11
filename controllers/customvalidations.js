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

function isDateAfter (before, after) {
  if (isDate(before) && isDate(after)) {
    if (new Date(before) < new Date(after)) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
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
  isDateAfter,
  isUnderAge
}
