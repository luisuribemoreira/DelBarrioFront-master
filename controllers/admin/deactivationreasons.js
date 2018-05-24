// Obtener todas las categorías de la api.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: lista todas las categorías.
// =======================================================================================
function GETAll (app) {
  return app.$axios.$get('private/motivo_deshabilitacion')
    .then(response => {
      return {
        deactivationreasons: response.data
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
  context.$axios.$post(
    'private/motivo_deshabilitacion',
    {
      NOMB_MOTIVO_DESHABILITACION: context.deactivationreason.NOMB_MOTIVO_DESHABILITACION
    }
  ).then(response => {
    context.deactivationreason = {}
    context.$router.push({ path: '/administracion/razon-desactivacion' })
    context.$notify.success('Se ha agregado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

// comentarios
function setState (context, deactivationreason) {
  context.$axios.$put(
    'private/motivo_deshabilitacion/' + deactivationreason.IDEN_MOTIVO_DESHABILITACION,
    {
      FLAG_VIGENTE: !deactivationreason.FLAG_VIGENTE
    }
  ).then(response => {
    deactivationreason.FLAG_VIGENTE = !deactivationreason.FLAG_VIGENTE
    console.log(response.data)
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

export default {
  GETAll,
  POST,
  setState
}
