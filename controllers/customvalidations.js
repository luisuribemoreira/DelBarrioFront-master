import moment from 'moment'

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
  var fechaActual = moment(new Date()).format('DD-MM-YYYY')
  var fechaInicio = moment(fecha).format('DD-MM-YYYY')
  if (fechaActual <= fechaInicio) {
    return true
  } else {
    return false
  }
}

function isDateAfter (before, after) {
  var fechaInicio = new Date(before)
  var fechaTermino = new Date(after)

  if (fechaInicio <= fechaTermino) {
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
