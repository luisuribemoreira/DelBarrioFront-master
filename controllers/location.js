// Obtener coordenadas de google maps a partir de dirección. Lleva la clave de aplicación como parámetro KEY
// Param.: app: instancia de aplicación || address: dirección en string
// Return: Obtiene objeto de geocode
// =======================================================================================
function GETLocation (app, address) {
  if (address == null) {
    address = ''
  }
  return app.$axios.$get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '+santiago+chile&key=AIzaSyCpibWdwMPOk18JLBCpaJj31xN768Z870U')
    .then(response => {
      return {
        geocode: response.results[0]
      }
    }).catch(errors => {
      console.log(errors)
    })
}

export default{
  GETLocation
}
