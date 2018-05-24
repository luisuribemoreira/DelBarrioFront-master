import controller from '~/controllers/auth'

export default function ({ isServer, store, app, req }) {
  if (isServer && !req) return
  const loggedUser = isServer ? controller.getUserFromCookie(req) : controller.getUserFromLocalStorage()
  const token = isServer ? controller.getTokenFromCookie(req) : controller.getTokenFromLocalStorage()
  store.commit('SET_USER', loggedUser)
  store.commit('SET_TOKEN', token)
  if (token) {
    app.$axios.setToken(token, 'Bearer')
  } else {
    app.$axios.setToken(false)
  }
}
