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
    context.message = errors.response ? errors.response.data.data.message : 'Error inesperado'
  })
}
function forgotPassword (context) {
  return context.$axios.$put(
    'forgot-pass',
    {
      email: context.auth.email
    }
  ).then(response => {
    context.error = false
    context.tokenAux = response.data.tokenAux
    context.$router.push({ path: '/' })
  }).catch(errors => {
    context.error = true
    context.message = errors.response ? errors.response.data.data.message : 'Error inesperado'
  })
}
function GETResetPassword (app, token) {
  return app.$axios.$get('reset-pass/' + token)
    .then(res => {
      return {
        token: token,
        user: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function PUTResetPassword (context, token) {
  return context.$axios.$put(
    'reset-pass/' + token,
    {
      DESC_PASSWORD: context.user.pass
    }
  ).then(response => {
    context.error = false
    context.processing = false
    context.message = false
    context.$router.push({ path: '/autenticar' })
    context.$notify.success('Se ha editado su contraseña exitosamente.')
  }).catch(errors => {
    context.processing = false
    context.$notify.danger('Ha ocurrido un error inesperado.')
    context.message = errors.response ? errors.response.data.data.message : 'Error inesperado'
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
  const token = window.localStorage.token
  if (!token) return
  Cookie.set('jwt', token)
  return token
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
  getUserFromLocalStorage,
  forgotPassword,
  PUTResetPassword,
  GETResetPassword
}
