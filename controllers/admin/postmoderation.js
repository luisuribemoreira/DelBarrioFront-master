function acceptPost (context, post) {
  context.$axios.$put(
    'private/publicacion/' + post.IDEN_PUBLICACION,
    {
      FLAG_VALIDADO: true
    }
  ).then(response => {
    post.FLAG_VALIDADO = true
    context.$notify.success('Se ha aceptado la publicación')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

function ban (context, post) {
  context.$axios.$put(
    'private/publicacion/' + post.IDEN_PUBLICACION,
    {
      FLAG_BAN: true
    }
  ).then(response => {
    post.FLAG_BAN = true
    context.$notify.success('Se ha rechazado la publicación')
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
  })
}

export default {
  acceptPost,
  ban
}
