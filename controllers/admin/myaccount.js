function GET (app, context) {
  // console.log(sessionStorage)
  // let token = sessionStorage.getItem('id_token')
  return app.$axios.$get('/private/usuario')
    .then(res => {
      return {
        user: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function PUT (context) {
  context.$router.push({ path: '/' })
  context.$notify.success('Se han modificado tus datos exitosamente.')
}

export default {
  GET,
  PUT
}
