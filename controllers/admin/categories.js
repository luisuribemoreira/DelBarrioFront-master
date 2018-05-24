// Obtener categoría especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function GET (app, id) {
  return app.$axios.$get('categoria/' + id)
    .then(res => {
      return {
        id: id,
        category: res.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}
function GETAll (app) {
  return app.$axios.$get('categoria')
    .then(response => {
      return {
        categories: response.data
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
    'private/categoria',
    {
      IDEN_CATEGORIA_PADRE: context.category.IDEN_CATEGORIA_PADRE,
      NOMB_CATEGORIA: context.category.NOMB_CATEGORIA
    }
  ).then(response => {
    context.category = {}
    context.$router.push({ path: '/administracion/categorias' })
    context.$notify.success('Se ha agregado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error. Inténtelo más tarde.')
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
    'private/categoria/' + context.id,
    {
      NOMB_CATEGORIA: context.category.NOMB_CATEGORIA,
      IDEN_CATEGORIA_PADRE: context.category.IDEN_CATEGORIA_PADRE
    }
  ).then(response => {
    context.$router.push({ path: '/administracion/categorias' })
    context.$notify.success('Se ha editado exitosamente.')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

// comentarios
function setState (context, category) {
  context.$axios.$put(
    'private/categoria/' + category.IDEN_CATEGORIA,
    {
      FLAG_VIGENTE: !category.FLAG_VIGENTE
    }
  ).then(response => {
    category.FLAG_VIGENTE = !category.FLAG_VIGENTE
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
