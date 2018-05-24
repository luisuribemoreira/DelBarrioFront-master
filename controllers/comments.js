// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                    }
// =======================================================================================
function POST (context) {
  // Creación de objeto dummy para simular respuesta instantánea del server
  // Eliminar atributos del objeto que no se estén utilizando en la vista (si hay alguno que no se use)
  // Menos IDEN_PUBLICACION y DESC_COMENTARIO, se están usando en Axios abajo
  let dummyEntity = {
    DESC_COMENTARIO: context.comment.DESC_COMENTARIO,
    IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
    FECH_CREACION: new Date().toJSON(),
    FLAG_BAN: false,
    IDEN_COMENTARIO: 0,
    IDEN_USUARIO: context.loggedUser.id,
    respuesta: {}
  }
  // Limpiar campo de comentario
  context.comment = {}
  // Agregar objeto dummy al comienzo del array de comentarios
  context.post.comentarios.unshift(dummyEntity)
  context.$scrollTo('#listComentarios')
  context.$axios.$post(
    'private/comentario',
    {
      IDEN_PUBLICACION: dummyEntity.IDEN_PUBLICACION,
      DESC_COMENTARIO: dummyEntity.DESC_COMENTARIO
    }).then(response => {
    context.$notify.success('Se ha enviado tu comentario.')
  }).catch(errors => {
    // Eliminar el objeto dummy del arreglo en caso de errores server-side
    context.post.comentarios.shift()
    // Volver a poner texto en el campo de comentario
    context.comment = {
      DESC_COMENTARIO: dummyEntity.DESC_COMENTARIO
    }
    context.$scrollTo('#comentarios')
    // Tirar una de esas notificaciones bien Spotify
    context.$notify.danger('Lo sentimos, ha ocurrido un error. Inténtalo más tarde')
  })
}

export default {
  POST
}
