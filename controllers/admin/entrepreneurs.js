// Obtener categoría especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('emprendedor/' + id)
    .then(res => {
      return {
        id: id,
        entrepreneur: res.data
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
    context.$axios.$post(
      'usuario',
      {
        EMAIL_USUARIO: context.entrepreneur.EMAIL_USUARIO,
        DESC_PASSWORD: context.entrepreneur.DESC_PASSWORD,
        IDEN_ROL: 2
      }
    ).then(response => {
      context.$axios.$post(
        'private/emprendedor',
        {
          IDEN_USUARIO: response.data.IDEN_USUARIO,
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
      })
    }).catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    })
  } else {
    context.message = 'Ingrese un rut válido'
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
  context.$axios.$put(
    'private/emprendedor/' + context.id,
    {
      DESC_EMPRENDEDOR: context.entrepreneur.DESC_EMPRENDEDOR,
      DESC_NOMBRE_FANTASIA: context.entrepreneur.DESC_NOMBRE_FANTASIA,
      DESC_NOMBRE_EMPRESA: context.entrepreneur.DESC_NOMBRE_EMPRESA,
      RUT_EMPRENDEDOR: parseInt(context.rut.slice(0, -1)),
      DV_EMPRENDEDOR: context.rut.slice(-1).toUpperCase()
    }
  ).then(response => {
    context.$router.push({ path: '/administracion/emprendedores' })
    context.$notify.success('Se ha editado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

// estado emprendedor
function setState (context, entrepreneur) {
  context.$axios.$put(
    'private/usuario/' + entrepreneur.usuario.IDEN_USUARIO,
    {
      FLAG_BAN: !entrepreneur.usuario.FLAG_BAN
    }
  ).then(response => {
    entrepreneur.usuario.FLAG_BAN = !entrepreneur.usuario.FLAG_BAN
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
