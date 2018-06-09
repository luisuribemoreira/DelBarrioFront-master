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
    // Fecha del dia de hoy
    let fechaActual = new Date()
    // Fecha ingresada en el formulario
    let fecha = new Date(date)
    // Comprueba, en orden, si han pasado al menos 18 años de la fecha ingresada
    // si el mes es mayor al actual
    // y finalmente si el mes actual es el mismo al ingresado y el dia actual es mayor o igual al ingresado.
    // Ej; Fecha actual: 10-05-2018, Fecha Ingresada: 11-05-2000 -> returns true, es menor de edad por 1 dia.
    if (fechaActual.getFullYear() - fecha.getFullYear() <= 18) {
      if (fechaActual.getMonth() > fecha.getMonth()) {
        return false
      } else if (fechaActual.getMonth() === fecha.getMonth() && fechaActual.getDate() >= fecha.getDate()) {
        return false
      } else {
        return true
      }
    } else {
      return true
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
