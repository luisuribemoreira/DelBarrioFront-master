// Enviar POST request a la fuente.
// Param.:       context -> Contiene los objetos instanciados en "data".
// Return:       Retorna los datos del POST response por consola js.
// Constraints:  post {
//                    }
// =======================================================================================
function POST (context) {
  // Creación de objeto dummy para simular respuesta instantánea del server
  let dummyEntity = {
    IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
    DESC_CALIFICACION: context.rating.DESC_CALIFICACION,
    NUMR_VALOR: parseInt(context.rating.NUMR_VALOR),
    FECH_CREACION: new Date()
  }
  // Agregar objeto dummy al comienzo del array de comentarios
  context.post.calificaciones.unshift(dummyEntity)
  context.$scrollTo('#rating')
  context.$axios.$post(
    'private/calificacion',
    {
      IDEN_PUBLICACION: context.post.IDEN_PUBLICACION,
      DESC_CALIFICACION: context.rating.DESC_CALIFICACION,
      NUMR_VALOR: context.rating.NUMR_VALOR
    }).then(response => {
    context.rating = {}
    context.$notify.success('Calificación enviada.')
  }).catch(errors => {
    // Eliminar el objeto dummy del arreglo en caso de errores server-side
    context.post.calificaciones.shift()
    // Volver a poner valor en el campo de calificación
    context.rating = {
      NUMR_VALOR: dummyEntity.NUMR_VALOR
    }
    context.$scrollTo('#calificaciones')
    // Notificación
    context.$notify.danger('Lo sentimos, ha ocurrido un error. Inténtalo más tarde')
  })
}

export default {
  POST
}
