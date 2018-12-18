/**
 * Este middleware se agrega directamente a las páginas
 * No a nuxt.config.js
 */
export default async function ({ store, redirect, route }) {
  // Si el usuario no está autenticado, redirecciona a /autenticar.
  if (!store.getters.isAuthenticated) {
    return redirect('/autenticar')
  } else {
    try {
      let user = (await store.$axios.get('/private/usuario/' + store.getters.loggedUser.id))
      if (!user.data.data.FECH_CREACION && !route.path.match(/\/sign-out/ig)) {
        return redirect('/registro-emprendedor')
      }
      if (store.getters.loggedUser.rol !== 102) {
        routesEntrepreneur(route.path, redirect)
      }
      if (store.getters.loggedUser.rol !== 103 && store.getters.loggedUser.rol !== 104) {
        routesAdmin(route.path, redirect)
      }
      if (store.getters.loggedUser.rol !== 104) {
        routesSuperAdmin(route.path, redirect)
      }
      if (store.getters.loggedUser.rol !== 101 && store.getters.loggedUser.rol !== 102) {
        routesClientAndEntrepreneur(route.path, redirect)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

// Rutas a las que puede acceder solo el emprendedor, rol 102.
function routesEntrepreneur (path, redirect) {
  // Restringir todas las rutas de las publicaciones en /administracion/publicaciones/...
  // Nueva, Editar, Crear Oferta, Mis Publicaciones
  if (path.match(/\/administracion\/publicaciones/ig)) {
    return redirect('/')
  }
}
// Rutas a las que puede acceder solo el cliente, rol 101 y el emprendedor, rol 102.

function routesClientAndEntrepreneur (path, redirect) {
  if (path.match(/\/mi-cuenta/gi)) {
    return redirect('/')
  }
}

// Rutas a las que puede acceder solo el administrador y super administrador, roles 103 y 104.
function routesAdmin (path, redirect) {
  // Restringir todas las rutas de moderacion en /administracion/moderar...
  // Moderar Publicacion y Moderar Oferta
  if (path.match(/\/administracion\/moderar-ofertas/ig)) {
    return redirect('/')
  }
  // Restringir ruta para administracion de denuncias en /administracion/denuncias
  if (path.match(/\/administracion\/denuncias/ig)) {
    return redirect('/')
  }
  // Restringir ruta para administracion de emprendedores en /administracion/emprendedores
  // Nuevo y Editar
  if (path.match(/\/administracion\/emprendedores/gi)) {
    return redirect('/')
  }
  // Restringir ruta para administracion de clientes en /administracion/clientes
  if (path.match(/\/administracion\/clientes/ig)) {
    return redirect('/')
  }
  // Restringir ruta para los Reportes en /administracion
  if (path.match(/^\/administracion$/i) || path.match(/^\/administracion\/$/i)) { // No funciona
    return redirect('/')
  }
  // Restringir ruta para administrar las categorias en /administracion/categorias
  // Index (Listado especial para administrarlas), Nueva y Editar
  if (path.match(/\/administracion\/categorias/gi)) { // No funciona
    return redirect('/')
  }
  // Restringir ruta para administrar los rubros en /administracion/rubros
  // Index (Listado especial para administrarlos), Nueva y Editar
  if (path.match(/\/administracion\/rubros/gi)) { // No funciona
    return redirect('/')
  }
  // Restringir ruta para administrar las razones de denuncia en /administracion/razon...
  // Razon Denuncia y Razon de Desactivacion
  if (path.match(/\/administracion\/razon/gi)) { // No funciona
    return redirect('/')
  }
  // Restringir ruta para administrar los terminos y condiciones en /administracion/terminos-condiciones
  if (path.match(/\/administracion\/terminos-condiciones/gi)) { // No funciona
    return redirect('/')
  }
  // Restringir ruta para administrar las preguntas frecuentes en /administracion/preguntas-frecuentes
  // Index (Listado especial para administrarlas), Nueva y Editar.
  if (path.match(/\/administracion\/preguntas-frecuentes/gi)) { // No funciona
    return redirect('/')
  }

  if (path.match(/\/configuracion-admin/gi)) {
    return redirect('/')
  }
}
// Rutas a las que puede acceder solo el super administrador, role 104.
function routesSuperAdmin (path, redirect) {
  // Restringir ruta para administrar a los administradores en /administracion/administradores
  // Index (Listado especial para administrarlos), Nuevo y Editar.
  if (path.match(/\/administracion\/administradores/gi)) { // Funciona
    return redirect('/')
  }
}
