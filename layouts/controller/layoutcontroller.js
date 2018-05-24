function search (app, context) {
  app.axios.get('/search', {
    params: {
      search: search
    }
  })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}

export default {
  logout () {
    sessionStorage.clear()
    location.reload()
  },
  search

}
