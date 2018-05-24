import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'

function login (context) {
  return context.$axios.$post(
    'auth',
    {
      email: context.auth.email,
      password: context.auth.password
    }
  ).then(response => {
    context.error = false
    context.$axios.setToken(response.data.token, 'Bearer')
    this.setToken(response.data.token)
  }).catch(errors => {
    context.error = true
    context.message = errors.response.data.data.message ? errors.response.data.data.message : 'Error inesperado'
  })
}

function setToken (token) {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', token)
  Cookie.set('jwt', token)
}

function unsetToken (context) {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('token')
  Cookie.remove('jwt')
  context.$axios.setToken(false)
}

function getTokenFromCookie (req) {
  if (!req.headers.cookie) return
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) return
  const jwt = jwtCookie.split('=')[1]
  return jwt
}

function getTokenFromLocalStorage () {
  return window.localStorage.token
}

function getUserFromCookie (req) {
  const jwt = this.getTokenFromCookie(req)
  if (!jwt) return undefined
  return jwtDecode(jwt)
}

function getUserFromLocalStorage () {
  const token = this.getTokenFromLocalStorage()
  return token ? jwtDecode(token) : undefined
}

export default {
  login,
  setToken,
  unsetToken,
  getTokenFromCookie,
  getTokenFromLocalStorage,
  getUserFromCookie,
  getUserFromLocalStorage
}
