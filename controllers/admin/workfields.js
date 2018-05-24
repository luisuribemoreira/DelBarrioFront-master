// Obtener rubro especifico según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: llena los datos del campo nombre.
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('rubro/' + id)
    .then(res => {
      return {
        id: id,
        workfield: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Obtener listado de rubros.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: listado de rubros para mostrados en la tabla de listFields.
// =======================================================================================
function GETAll (app) {
  return app.$axios.$get('rubro')
    .then(response => {
      return {
        workfields: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Enviar POST request a la fuente.
// Param.:       context -> Contexto de la vista .vue, contiene los objetos instanciados en
//               "data".
// Constraints:  post { NOMB_RUBRO: string (required) }
// =======================================================================================
function POST (context) {
  context.$axios.$post(
    'private/rubro',
    {
      NOMB_RUBRO: context.workfield.NOMB_RUBRO
    }
  ).then(response => {
    context.workfield = {}
    context.$router.push({ path: '/administracion/rubros' })
    context.$notify.success('Se ha agregado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

// Enviar PUT request a la fuente
// Param.:       context -> Contexto de la vista .vue, contiene los objetos instanciados en
//               "data".
// Constraints:  post { NOMB_CATEGORIA: string (required) }
// =======================================================================================
function PUT (context) {
  context.$axios.$put(
    'private/rubro/' + context.id,
    {
      NOMB_RUBRO: context.workfield.NOMB_RUBRO
    }
  ).then(response => {
    context.$router.push({ path: '/administracion/rubros' })
    context.$notify.success('Se ha editado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

// comentarios
function setState (context, workfield) {
  context.$axios.$put(
    'private/rubro/' + workfield.IDEN_RUBRO,
    {
      FLAG_VIGENTE: !workfield.FLAG_VIGENTE
    }
  ).then(response => {
    workfield.FLAG_VIGENTE = !workfield.FLAG_VIGENTE
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

export default {
  GET,
  GETAll,
  POST,
  PUT,
  setState
}
