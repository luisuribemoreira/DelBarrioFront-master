// Obtener categoria especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('faq/' + id)
    .then(res => {
      return {
        id: id,
        f: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Obtener todas las categorías de la api.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function GETAll (app) {
  return app.$axios.$get('faq')
    .then(response => {
      return {
        faqs: response.data
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
    'private/faq',
    {
      NOMB_FAQ: context.f.NOMB_FAQ,
      DESC_FAQ: context.f.DESC_FAQ
    }
  ).then(response => {
    context.f = {}
    context.$router.push({ path: '/administracion/preguntas-frecuentes' })
    context.$notify.success('Se ha agregado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
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
  context.$axios.$put(
    'private/faq/' + context.id,
    {
      NOMB_FAQ: context.f.NOMB_FAQ,
      DESC_FAQ: context.f.DESC_FAQ
    }
  ).then(response => {
    context.$router.push({ path: '/administracion/preguntas-frecuentes' })
    context.$notify.success('Se ha editado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

function DELETE (f, context) {
  context.$axios.$delete(
    'private/faq/' + f.IDEN_FAQ
  ).then(response => {
    context.faqs = context.faqs.filter(item => item !== f)
    context.$notify.success('Se ha eliminado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

export default {
  GET,
  GETAll,
  POST,
  PUT,
  DELETE
}
