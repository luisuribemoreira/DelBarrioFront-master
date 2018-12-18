<template>
  <section id="admin-faq" class="container-fluid">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Administradores</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-1 col-md-4 py-2">
          <nuxt-link to="/administracion/administradores/nuevo" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-lg-4 offset-md-3 col-md-6 offset-sm-3 py-1">
          <div class="input-group">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar nombre de administrador..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarAdmin()">
            <span class="input-group-append">
            <button class="btn btn-outline-secondary border-left-0" type="submit">
              <i class="fa fa-search"></i>
            </button>
            </span>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-12 table-responsive">
          <table class="table table-hover table-sm">
            <thead class="text-center">
              <tr>
                <th>Estado</th>
                <th>E-mail</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr :key="client.IDEN_PERSONA" v-for="client in paginatedData[pagination]">
                <td>
                  <icon :name="client.usuario.FLAG_BAN ? 'times' : 'check'" :title="client.usuario.FLAG_BAN ? 'Deshabilitado' : 'Habilitado'"></icon>
                  </td>
                <td>{{client.usuario.EMAIL_USUARIO}}</td>
                <td>{{client.NOMBRES + ' ' + client.APELLIDO_PATERNO+ ' ' +client.APELLIDO_MATERNO}}</td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/administradores/editar/'+client.IDEN_PERSONA }">
                    <button class="btn btn-tabla" title="Editar">Editar</button>
                  </nuxt-link>
                  <a @click="setState(client)" class="btn">
                    <button class="btn btn-tabla" v-if="client.usuario.FLAG_BAN">Habilitar</button>
                    <button class="btn btn-tabla" v-if="!client.usuario.FLAG_BAN">Deshabilitar</button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table><!-- /tabla -->
               <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <!-- Solo permite retroceder si la pagina actual es mayor a 0 -->
                <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
                  <span class="page-link" :aria-hidden="true">&laquo;</span>
                </span>
              </li>
              <!-- Se crea la paginacion al pie de pagina. Se usa page - 1 ya que pagination debe apuntar a los indices del arreglo, por lo que parte de 0 -->
              <li class="page-item" v-bind:key="page" v-for="page in pages">
                <!-- Si la pagina actual es igual a la clickeada, esta se ennegrece -->
                <span class="page-link" v-bind:class="{ 'font-weight-bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>

        <!-- /paginacion -->
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import controller from '~/controllers/admin/admins'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ clients }) => {
        clients.sort(function (a, b) {
          return a.NOMBRES.localeCompare(b.NOMBRES, 'es', { numeric: true })
        })
        return custompaginator.paginate(clients)
          .then(({ paginatedData }) => {
            let pages = paginatedData.length
            return {
              clients,
              paginatedData,
              pages
            }
          })
      })
  },
  data () {
    return {
      clients: [],
      search: '',
      postsAux: [],
      pagination: 0,
      pages: 0,
      paginatedData: [[]]
    }
  },
  methods: {
    setState (client) {
      controller.setState(this, client)
    },
    buscarAdmin () {
      // Copiar todos los clientes, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.paginatedData
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los clientes en que el nombre, apellidos o parte de ellos posea el texto escrito en el buscador
        let cadena = this.search.trim().split(' ')
        let cliSearch = this.clients.map(client => {
          for (let i = 0; i < cadena.length; i++) {
            let palabraBusqueda = new RegExp(cadena[i], 'gi')
            if (client.NOMBRES.match(palabraBusqueda) || client.APELLIDO_PATERNO.match(palabraBusqueda) ||
                client.APELLIDO_MATERNO.match(palabraBusqueda)) return client
          }
        })

        // Limpia los clientes actuales y lo llena con los clientes que cumplan el criterio de busqueda
        let cliFound = []
        cliSearch.forEach(client => {
          if (client) cliFound.push(client)
        })

        // Ordena los Clientes en orden lexicografico.
        cliFound.sort(function (a, b) {
          return a.NOMBRES.localeCompare(b.NOMBRES)
        })
        // Se llama al paginador con la lista de objetos encontrados
        custompaginator.paginate(cliFound)
          .then(({ paginatedData }) => {
            // Se reemplaza la lista paginada actual por la que contiene solo los objetos de la busqueda
            this.paginatedData = paginatedData
            // La cantidad total de paginas se reemplaza por la cantidad de paginas
            // de la nueva lista de objetos encontrados por la busqueda
            this.pages = paginatedData.length
            this.pagination = 0 // Se envia a la pagina inicial en caso de que la busqueda contenga mas de 10 objetos
          })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.paginatedData = this.postsAux
        this.pagination = 0
        this.pages = this.paginatedData.length
      }
    }
  },
  middleware: 'authenticated',
  head () {
    return {
      title: 'Moderar Administradores',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
