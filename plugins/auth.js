export default ({store, app: { $axios }}) => {
  store.state.token ? $axios.setToken(store.state.token, 'Bearer') : $axios.setToken(false)
}
