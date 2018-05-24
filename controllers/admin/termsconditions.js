// Obtener categoría especifica según id.
// Param.: context -> Contexto de la vista .vue, contiene los objetos instanciados en "data".
// Return: Promise
// =======================================================================================
function saveTermsConditions (context) {
  const formData = new FormData()
  formData.append('TERMINOS_CONDICIONES', context.file, context.file.name)
  return context.$axios.$post('private/terminos_condiciones/', formData)
    .then(res => {
      context.$notify.success('Se ha agregado exitosamente.')
      context.$router.push({ path: '/' })
    }).catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado. Inténtelo más tarde.')
    })
}

export default {
  saveTermsConditions
}
