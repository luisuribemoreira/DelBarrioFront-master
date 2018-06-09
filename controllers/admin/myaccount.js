function GET (app, id) {
// console.log(sessionStorage)
// let token = sessionStorage.getItem('id_token')
  return app.$axios.$get('/private/usuario/' + id)
    .then(res => {
      return {
        user: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function PUT (context, user) {
  return context.$axios.$put('/private/persona/' + user.persona.IDEN_PERSONA,
    {
      NOMBRES: user.persona.NOMBRES,
      APELLIDO_PATERNO: user.persona.APELLIDO_PATERNO,
      APELLIDO_MATERNO: user.persona.APELLIDO_MATERNO,
      FECH_FECHA_NACIMIENTO: user.persona.FECH_FECHA_NACIMIENTO
    })
    .then(response => {
      if (user.pass) {
        return context.$axios.$put('/private/usuario/' + user.IDEN_USUARIO,
          {
            DESC_PASSWORD: user.pass
          })
          .then(res => {
            context.$router.push({ path: '/' })
            context.$notify.success('Se han modificado tus datos exitosamente.')
          }).catch(err => {
            if (err) context.$notify.warning('Ha ocurrido un error inesperado.')
          })
      }
      context.$router.push({ path: '/' })
      context.$notify.success('Se han modificado tus datos exitosamente.')
    }).catch(error => {
      if (error) context.$notify.warning('Ha ocurrido un error inesperado.')
    })
}

export default {
  GET,
  PUT
}
