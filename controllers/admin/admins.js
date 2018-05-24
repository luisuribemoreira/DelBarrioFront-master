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
  context.$notify.success('Se ha agregado exitosamente')
  context.$router.push({ path: '/administracion' })
  /*
  if (RutValidation(context.client.RUT_USUARIO)) {
    context.$axios.$post(
      'usuario',
      {
        EMAIL_USUARIO: context.client.EMAIL_USUARIO,
        DESC_PASSWORD: context.client.DESC_PASSWORD
      }
    ).then(response => {
      context.$axios.$post(
        'persona',
        {
          IDEN_USUARIO: response.data.IDEN_USUARIO
          // AGREGAR DATOS DE CLIENTE
        }
      ).then(response => {
        context.client = {}
        // SE TIENE QUE AUTENTICAR AUTOMÁTICAMENTE
        context.$notify.success('Se ha creado tu cuenta exitosamente.')
      }).catch(errors => {
        context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
      })
    }).catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    })
  } else {
    context.message = 'Ingrese un rut válido'
  }
  */
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
  context.$notify.success('Se ha modificado exitosamente')
  context.$router.push({ path: '/administracion' })
  /*
  context.$axios.$put(
    'private/persona/' + context.id,
    {
      // AGREGAR DATOS CLIENTE
    }
  ).then(response => {
    context.message = 'Editado exitosamente!'
    context.$router.push({ path: '/administracion/clientes' })
  }).catch(errors => {
    context.message = errors.response.data.message ? errors.response.data.message : 'Error inesperado'
  }) */
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
