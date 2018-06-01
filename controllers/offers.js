import imagecontroller from '~/controllers/images'
// Obtener todas las ofertas de la api.
// Param.: app -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: lista todas las ofertas.
// =======================================================================================
function GETAll (app) {
  return app.$axios.$get(
    'oferta'
  ).then(oferta => {
    return imagecontroller.getAll().then(imagen => {
      let imagenes = {}
      oferta.data.forEach(offer => {
        imagenes[offer.IDEN_PUBLICACION] = imagen.data.find(img => img.IDEN_PUBLICACION === offer.IDEN_PUBLICACION)
      })
      return {
        offers: oferta.data,
        images: imagenes
      }
    })
  }).catch(errors => {
    console.log(errors)
  })
}

export default {
  GETAll
}
