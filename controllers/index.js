function GETAll (app) {
  return app.$axios.$get('index')
    .then(response => {
      return {
        index: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

export default {
  GETAll
}
