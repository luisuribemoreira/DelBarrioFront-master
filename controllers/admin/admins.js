// Obtener categoría especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('persona/' + id)
    .then(res => {
      return {
        id: id,
        user: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function GETAll (app) {
  return app.$axios.$get('private/administradores')
    .then(response => {
      return {
        clients: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                      title: string (req | len < 255)
//                      body:  string (req | len < 255)
//                    }
// =======================================================================================
function POST (context) {
  return context.$axios.$post(
    'usuario',
    {
      EMAIL_USUARIO: context.user.EMAIL_USUARIO,
      DESC_PASSWORD: context.user.DESC_PASSWORD,
      IDEN_ROL: 3, // Rol de Administrador.
      FECH_CREACION: 1 // Se auto genera en la API
    }
  ).then(response => {
    console.log(response.data)
    context.$axios.$post(
      'private/persona',
      {
        IDEN_USUARIO: response.data.IDEN_USUARIO,
        NOMBRES: context.user.NOMBRES,
        APELLIDO_PATERNO: context.user.APELLIDO_PATERNO,
        APELLIDO_MATERNO: context.user.APELLIDO_MATERNO,
        FECH_FECHA_NACIMIENTO: context.user.FECH_FECHA_NACIMIENTO
      }
    ).then(() => {
      context.$notify.success('Se ha agregado exitosamente')
      context.$router.push({ path: '/administracion/administradores' })
    }).catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
      return -1
    })
  }).catch(errors => {
    if (errors.response.data.data.EMAIL_USUARIO) {
      context.message = errors.response.data.data.EMAIL_USUARIO
    } else {
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    }
    return -1
  })
}

// Enviar PUT request a la fuente. Se utilizó placeholder.
// Param.:       context -> Contexto de la vista .vue, contiene los objetos instanciados en
//               "data".
// Return:       Retorna los datos del PUT response por consola js.
// Constraints:  post {
//                      title:  string (req | len < 255)
//                      body:   string (req | len < 255)
//                      userId: int (req | user-exists)
//                      id:     int (req | post-exists)
//                    }
// =======================================================================================
function PUT (context) {
  return context.$axios.$put('private/usuario/' + context.user.IDEN_USUARIO,
    {
      EMAIL_USUARIO: context.user.usuario.EMAIL_USUARIO
    }
  ).then(response => {
    return context.$axios.$put(
      'private/persona/' + context.user.IDEN_PERSONA,
      {
        NOMBRES: context.user.NOMBRES,
        APELLIDO_PATERNO: context.user.APELLIDO_PATERNO,
        APELLIDO_MATERNO: context.user.APELLIDO_MATERNO,
        FECH_FECHA_NACIMIENTO: context.user.FECH_FECHA_NACIMIENTO
      })
      .then(res => {
        context.$router.push({ path: '/administracion/administradores' })
        context.$notify.success('Se ha editado exitosamente.')
      }).catch(err => {
        if (err) context.$notify.warning('Ha ocurrido un error inesperado.')
        return -1
      })
  }).catch(error => {
    if (error.response && error.response.data.data.EMAIL_USUARIO) {
      context.message = error.response.data.data.EMAIL_USUARIO
    } else {
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    }
    return -1
  })
}

// estado persona
function setState (context, client) {
  context.$axios.$put(
    'private/usuario/' + client.usuario.IDEN_USUARIO,
    {
      FLAG_BAN: !client.usuario.FLAG_BAN
    }
  ).then(response => {
    client.usuario.FLAG_BAN = !client.usuario.FLAG_BAN
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

function RutValidation (Objeto) {
  if (Objeto != null) {
    var tmpstr = ''
    var intlargo = Objeto
    if (intlargo.length > 0) {
      var crut = Objeto
      var largo = crut.length
      if (largo < 2) {
        return false
      }
      for (var i = 0; i < crut.length; i++) {
        if (crut.charAt(i) !== ' ' && crut.charAt(i) !== '.' && crut.charAt(i) !== '-') {
          tmpstr = tmpstr + crut.charAt(i)
        }
      }
      var rut = tmpstr
      crut = tmpstr
      largo = crut.length
      if (largo > 2) {
        rut = crut.substring(0, largo - 1)
      } else {
        rut = crut.charAt(0)
      }
      var dv = crut.charAt(largo - 1)
      if (rut === null || dv === null) {
        return 0
      }
      var dvr = '0'
      var suma = 0
      var mul = 2
      for (i = rut.length - 1; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul
        if (mul === 7) {
          mul = 2
        } else {
          mul++
        }
      }
      var res = suma % 11
      if (res === 1) {
        dvr = 'k'
      } else {
        if (res === 0) {
          dvr = '0'
        } else {
          var dvi = 11 - res
          dvr = dvi + ''
        }
      }
      if (dvr !== dv.toLowerCase()) {
        return false
      }
      return true
    }
  }
}

export default {
  GET,
  GETAll,
  POST,
  PUT,
  setState,
  RutValidation
}
