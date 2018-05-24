// Obtener todas las categorías de la api.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: lista todas las categorías.
// =======================================================================================
function GETAll (app) {
  return app.$axios.$get('motivo_denuncia')
    .then(response => {
      return {
        denouncereasons: response.data
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
    'private/motivo_denuncia',
    {
      NOMB_MOTIVO_DENUNCIA: context.denouncereason.NOMB_MOTIVO_DENUNCIA
    }
  ).then(response => {
    context.$router.push({ path: '/administracion/razon-denuncia' })
    context.$notify.success('Se ha agregado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

// comentarios
function setState (context, denouncereason) {
  context.$axios.$put(
    'private/motivo_denuncia/' + denouncereason.IDEN_MOTIVO_DENUNCIA,
    {
      FLAG_VIGENTE: !denouncereason.FLAG_VIGENTE
    }
  ).then(response => {
    denouncereason.FLAG_VIGENTE = !denouncereason.FLAG_VIGENTE
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

export default {
  GETAll,
  POST,
  setState
}
