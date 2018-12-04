async function paginate (data, maxItems = 12) { // Si no se indica la cantidad maxima de items por pagina estos seran 10 por defecto
  // Se asigna valor por defecto a maxItems en caso de ser menor o igual a 0 o de no ser un numero para evitar errores.
  if (!Number(maxItems) || maxItems <= 0) maxItems = 12
  // Se crea un arreglo bidimensional para guardar los objetos paginados
  // donde el indice del primer nivel del arreglo actua como numero de pagina
  let paginatedData = [[]]
  let pagination = 0
  data.forEach((item, index) => {
    // Dentro del segundo nivel del arreglo se guardan los datos
    // Ej: [ ['a', 'b'], ['c', 'd'] ]...
    paginatedData[pagination].push(item)
    if ((index + 1) % maxItems === 0 && data[index + 1]) {
      // Cada vez que se llegue al decimo objeto
      // se agrega un nuevo arreglo para que actue como una nueva pagina
      pagination++
      paginatedData[pagination] = []
    }
  })
  return {
    paginatedData
  }
}

export default {
  paginate
}
