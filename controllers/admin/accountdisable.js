// Obtiene la ultima deshabilitacion que aun este vigente de un usuario especifico
function GETByUser (context, client) {
  return context.$axios.$get('private/deshabilitacion_cuenta')
    .then(response => {
      let deshabilitaciones = response.data
      let deshabilitacionUsuario = {}
      deshabilitaciones.forEach(deshabilitacion => {
        if (deshabilitacion.IDEN_USUARIO === client.usuario.IDEN_USUARIO && deshabilitacion.FLAG_VIGENTE) {
          deshabilitacionUsuario = deshabilitacion
        }
      })
      return {
        deshabilitacionUsuario: deshabilitacionUsuario
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function GETAll (context) {
  return context.$axios.$get('private/deshabilitacion_cuenta')
    .then(response => {
      return {
        deshabilitaciones: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

function POST (context) {
  return context.$axios.$post('private/deshabilitacion_cuenta',
    {
      IDEN_USUARIO: context.deshabilitacion.client.usuario.IDEN_USUARIO,
      IDEN_MOTIVO_DESHABILITACION: context.deshabilitacion.IDEN_MOTIVO_DESHABILITACION,
      DESC_COMENTARIO: context.deshabilitacion.DESC_COMENTARIO
    })
    .then(response => {
      context.$notify.success('Usuario deshabilitado exitosamente.')
      return {
        disabled: response.data
      }
    }).catch(errors => {
      if (errors) {
        console.log(errors.data)
        context.$notify.danger('Ha ocurrido un error inesperado.')
      }
    })
}

function PUT (context, deshabilitacion) {
  return context.$axios.$put('private/deshabilitacion_cuenta/' + deshabilitacion.IDEN_DESHABILITACION_CUENTA,
    {
      FLAG_VIGENTE: deshabilitacion.FLAG_VIGENTE
    })
    .then(() => {
      context.$notify.success('Usuario habilitado exitosamente.')
    }).catch(errors => {
      if (errors) {
        console.log(errors.data)
        context.$notify.danger('Ha ocurrido un error inesperado.')
      }
    })
}
export default {
  GETByUser,
  GETAll,
  POST,
  PUT
}
