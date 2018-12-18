export const state = () => ({
  user: null,
  token: null,
  title: ''
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user || null
  },
  SET_TOKEN (state, token) {
    state.token = token || null
  },
  SET_TITLE (state, title) {
    state.title = title || ''
  }
}

export const getters = {
  isAuthenticated (state) {
    return state.user
  },
  loggedUser (state) {
    return state.user
  },
  token (state) {
    return state.token
  },
  getTitle (state) {
    return state.title
  }
}
