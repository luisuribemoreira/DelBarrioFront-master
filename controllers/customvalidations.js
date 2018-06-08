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
    if (Number(new Date().getFullYear()) - Number(new Date(date).getFullYear()) < 18) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export default {
  isDate,
  isDefined,
  isDateAfter,
  isUnderAge
}
