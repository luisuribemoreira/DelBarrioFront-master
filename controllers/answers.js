// Obtener todas las categorías de la api.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: lista todas las publicaciones.
// =======================================================================================
function GETAll (app) {
  return app.$axios.$get('private/comentario')
    .then(response => {
      return {
        comments: response.data
      }
    }).catch(errors => {
      console.log(errors)
    })
}

// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                      IDEN_TIPO_PUBLICACION: id (req)
//                      IDEN_CATEGORIA:  id (req)
//                      NOMB_PUBLICACION: string (req | len < 255)
//                      DESC_PUBLICACION: string (req | len < 10.000)
//                      NUMB_PRECIO: int (req | > 0)
//                      FLAG_CONTENIDO_ADULTO: bool
//                    }
// =======================================================================================
function POST (context) {
  if (context.answer.DESC_RESPUESTA === undefined || context.answer.DESC_RESPUESTA.length < 1 || context.answer.DESC_RESPUESTA > 255) {
    context.message.answer = 'Ingrese una respuesta'
    context.message.error = true
  } else {
    context.message.error = false
    // Creacion de objeto dummy para simular respuesta instantánea del server
    let dummyEntity = {
      DESC_RESPUESTA: context.answer.DESC_RESPUESTA,
      FECH_CREACION: new Date().toJSON(),
      IDEN_RESPUESTA: true
    }
    // Vacia campo respuesta
    context.answer = {}
    // Agrega objeto respuesta a la propiedad respuesta del comentario correspondiente
    context.post.comentarios.find((comment) => comment.IDEN_COMENTARIO === parseInt(context.selected)).respuesta = dummyEntity
    return context.$axios.$post(
      'private/respuesta',
      {
        IDEN_COMENTARIO: parseInt(context.selected),
        DESC_RESPUESTA: dummyEntity.DESC_RESPUESTA
      }).then(response => {
      context.answer = { }
      // context.$router.push({ path: '/administracion/respuestas' }) toDo
      context.$notify.success('Se ha enviado tu respuesta.')
    }).catch(errors => {
      // Eliminar objecto en caso de error
      context.post.comentarios.find((comment) => comment.IDEN_COMENTARIO === parseInt(context.selected)).respuesta = {}
      // Devolver texto en el campo de respuesta
      context.answer = { DESC_RESPUESTA: dummyEntity.DESC_RESPUESTA }
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    })
  }
}

// =======================================================================================
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
function setState (context, post) {
  if (!post.FLAG_BAN) {
    context.$axios.$post(
      'private/comentario/' + post.IDEN_PUBLICACION,
      {
        FLAG_VIGENTE: !post.FLAG_VIGENTE
      }
    ).then(response => {
      post.FLAG_VIGENTE = !post.FLAG_VIGENTE
    }).catch(errors => {
      console.log(errors)
    })
  }
}

export default {
  GETAll,
  POST,
  setState
}
