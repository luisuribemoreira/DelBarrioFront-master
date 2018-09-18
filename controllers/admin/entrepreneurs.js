// Obtener categoría especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('emprendedor/' + id)
    .then(res => {
      let entrepreneur = res.data
      if (entrepreneur.usuario.persona && entrepreneur.usuario.persona.IDEN_PERSONA) {
        return app.$axios.$get('/contacto/' + entrepreneur.usuario.persona.IDEN_PERSONA)
          .then(response => {
            entrepreneur.usuario.persona.contacto = response.data
            return {
              id: id,
              entrepreneur: res.data
            }
          })
      } else {
        return {
          id: id,
          entrepreneur: res.data
        }
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function GETAll (app) {
  return app.$axios.$get('emprendedor')
    .then(response => {
      return {
        entrepreneurs: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Retorna el emprendedor con la ID de usuario
// Param.: userId -> ID del usuario actual
function GETUser (app, userId) {
  return app.$axios.$get(
    'emprendedor'
  ).then(response => {
    let entrepeneur = response.data.find(ent => ent.IDEN_USUARIO === userId)
    return {
      entrepeneur: entrepeneur
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
  if (RutValidation(context.entrepreneur.RUT_EMPRENDEDOR)) {
    if (context.entrepreneur.FECH_CREACION && context.entrepreneur.FECH_CREACION === -1) {
      // La fecha de creacion no se envia para que quede en null.
      return context.$axios.$post(
        'usuario',
        {
          EMAIL_USUARIO: context.entrepreneur.EMAIL_USUARIO,
          DESC_PASSWORD: context.entrepreneur.DESC_PASSWORD,
          IDEN_ROL: 2
        }
      ).then(response => {
        return context.$axios.$post(
          'private/emprendedor',
          {
            IDEN_USUARIO: response.data.IDEN_USUARIO,
            IDEN_RUBRO: context.entrepreneur.IDEN_RUBRO,
            DESC_EMPRENDEDOR: context.entrepreneur.DESC_EMPRENDEDOR,
            DESC_NOMBRE_FANTASIA: context.entrepreneur.DESC_NOMBRE_FANTASIA,
            DESC_NOMBRE_EMPRESA: context.entrepreneur.DESC_NOMBRE_EMPRESA,
            RUT_EMPRENDEDOR: parseInt(context.entrepreneur.RUT_EMPRENDEDOR.slice(0, -1)),
            DV_EMPRENDEDOR: context.entrepreneur.RUT_EMPRENDEDOR.slice(-1).toUpperCase()
          }
        ).then(response => {
          context.entrepreneur = {}
          context.$router.push({ path: '/administracion/emprendedores' })
          context.$notify.success('Se ha agregado exitosamente.')
        }).catch(errors => {
          context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
          return errors
        })
      }).catch(errors => {
        if (errors.response.data.data.EMAIL_USUARIO) {
          context.message = errors.response.data.data.EMAIL_USUARIO
        } else {
          context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
        }
        return errors
      })
    } else {
      return context.$axios.$post(
        'usuario',
        {
          EMAIL_USUARIO: context.entrepreneur.EMAIL_USUARIO,
          DESC_PASSWORD: context.entrepreneur.DESC_PASSWORD,
          IDEN_ROL: 2,
          FECH_CREACION: 1 // En la api se cambia a new Date(). No se hace aqui para que no tome la fecha del computador del cliente.
        }
      ).then(response => {
        return context.$axios.$post(
          'private/emprendedor',
          {
            IDEN_USUARIO: response.data.IDEN_USUARIO,
            IDEN_RUBRO: context.entrepreneur.IDEN_RUBRO,
            DESC_EMPRENDEDOR: context.entrepreneur.DESC_EMPRENDEDOR,
            DESC_NOMBRE_FANTASIA: context.entrepreneur.DESC_NOMBRE_FANTASIA,
            DESC_NOMBRE_EMPRESA: context.entrepreneur.DESC_NOMBRE_EMPRESA,
            RUT_EMPRENDEDOR: parseInt(context.entrepreneur.RUT_EMPRENDEDOR.slice(0, -1)),
            DV_EMPRENDEDOR: context.entrepreneur.RUT_EMPRENDEDOR.slice(-1).toUpperCase()
          }
        ).then(response => {
          context.entrepreneur = {}
          context.$router.push({ path: '/administracion/emprendedores' })
          context.$notify.success('Se ha agregado exitosamente.')
        }).catch(errors => {
          context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
          return errors
        })
      }).catch(errors => {
        context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
        return errors
      })
    }
  } else {
    context.message = 'Ingrese un rut válido'
    return -1
  }
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
  if (RutValidation(context.rut)) {
    return context.$axios.$put('private/usuario/' + context.entrepreneur.usuario.IDEN_USUARIO,
      {
        EMAIL_USUARIO: context.entrepreneur.usuario.EMAIL_USUARIO
      }
    ).then(response => {
      return context.$axios.$put(
        'private/emprendedor/' + context.id,
        {
          DESC_EMPRENDEDOR: context.entrepreneur.DESC_EMPRENDEDOR,
          IDEN_RUBRO: context.entrepreneur.IDEN_RUBRO,
          DESC_NOMBRE_EMPRESA: context.entrepreneur.DESC_NOMBRE_EMPRESA,
          RUT_EMPRENDEDOR: parseInt(context.rut.slice(0, -1)),
          DV_EMPRENDEDOR: context.rut.slice(-1).toUpperCase()
        })
        .then(res => {
          context.processing = false
          context.message = false
          context.$router.push({ path: '/administracion/emprendedores' })
          context.$notify.success('Se ha editado exitosamente.')
        }).catch(errors => {
          if (errors) context.$notify.warning('Ha ocurrido un error inesperado.')
          context.message = false
          context.processing = false
        })
    }).catch(error => {
      if (error.response) {
        context.message = error.response.data.data.EMAIL_USUARIO
      } else {
        context.$notify.warning('Ha ocurrido un error inesperado.')
      }
      context.processing = false
    })
  } else {
    context.processing = false
    context.message = 'Ingrese un rut válido.'
  }
}

// estado emprendedor
function setState (context, entrepreneur) {
  return context.$axios.$put(
    'private/usuario/' + entrepreneur.usuario.IDEN_USUARIO,
    {
      FLAG_BAN: !entrepreneur.usuario.FLAG_BAN
    }
  ).then(response => {
    entrepreneur.usuario.FLAG_BAN = !entrepreneur.usuario.FLAG_BAN
    return {
      data: response.data,
      disabled: true
    }
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    return errors
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
  GETUser,
  POST,
  PUT,
  setState,
  RutValidation
}
