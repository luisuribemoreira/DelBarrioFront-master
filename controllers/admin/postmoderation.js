function acceptPost (context, post) {
  context.$axios.$put(
    'private/publicacion/' + post.IDEN_PUBLICACION,
    {
      FLAG_VALIDADO: true,
      FECH_APROBACION: 1
    }
  ).then(response => {
    post.FLAG_VALIDADO = true
    context.$notify.success('Se ha aceptado la publicación')
    context.processing = false
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    context.processing = false
  })
}

function acceptOffer (context, offer) {
  context.$axios.$put(
    'private/oferta/' + offer.IDEN_OFERTA,
    {
      FLAG_VALIDADO: true
    }
  ).then(response => {
    offer.FLAG_VALIDADO = true
    context.$notify.success('Se ha aceptado la publicación')
    context.processing = false
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    context.processing = false
  })
}

function ban (context, post) {
  context.$axios.$put(
    'private/publicacion/' + post.IDEN_PUBLICACION,
    {
      FLAG_BAN: true,
      FECH_RECHAZO: 1
    }
  ).then(response => {
    post.FLAG_BAN = true
    context.$notify.success('Se ha rechazado la publicación')
    context.processing = false
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    context.processing = false
  })
}
function banOffer (context, offer) {
  context.$axios.$put(
    'private/oferta/' + offer.IDEN_OFERTA,
    {
      FLAG_BAN: true
    }
  ).then(response => {
    offer.FLAG_BAN = true
    context.$notify.success('Se ha rechazado la publicación')
    context.processing = false
  }).catch(errors => {
    context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    context.processing = false
  })
}

export default {
  acceptPost,
  acceptOffer,
  ban,
  banOffer
}
