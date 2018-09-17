<template>
  <section id="admin-faq" class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center py-1">Clientes</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 offset-md-4 col-md-6 offset-sm-3 py-1">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model.trim="search" placeholder="Buscar por Nombres o Apellidos del Cliente..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarCliente()">
            <div class="input-group-btn">
              <icon name="search"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-12 table-responsive">
          <table class="table">
            <thead>
              <tr class="text-center">
                <th>Estado</th>  
                <th>E-mail</th>
                <th>Nombre</th>
                <th>Fecha de nacimiento</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr :key="client.IDEN_PERSONA" v-for="client in paginatedData[pagination]">
                <td><icon :name="client.usuario.FLAG_BAN ? 'times' : 'check'" :title="client.usuario.FLAG_BAN ? 'Deshabilitado' : 'Habilitado'"></icon></td>
                <td>{{client.usuario.EMAIL_USUARIO}}</td>
                <td>{{client.NOMBRES + ' ' + client.APELLIDO_PATERNO+ ' ' +client.APELLIDO_MATERNO}}</td>
                <td>{{client.FECH_FECHA_NACIMIENTO | dateFormat }}</td>
                <td>
                  <a class="btn"  @click="setState(client)">
                  <button class="btn btn-tabla" v-if="client.usuario.FLAG_BAN">Habilitar</button>
                  <button class="btn btn-tabla" v-if="!client.usuario.FLAG_BAN" :data-toggle="enabled ? 'modal' : ''" :data-target= "isAuthenticated ? '#disableModal' : ''" @click="check(), deshabilitacion.client = client ">Deshabilitar</button>
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
                <span class="page-link" v-bind:class="{ 'font-weight: bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
              </li>
              <li class="page-item">
                <!-- Solo permite avanzar si la pagina actual es inferior a la cantidad de paginas totales - 1 -->
                <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
                  <span class="page-link" :aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>
          <div class="modal fade" id="disableModal" v-if="isAuthenticated" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" ref="modalDismiss" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Deshabilitar Cliente</h4>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="validateDisable()">
                    <h5>Selecciona el motivo de deshabilitación</h5>
                    <div class="form-group" :key="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-for="deactivationreason in deactivationreasons">
                      <div class="radio">
                        <label>
                          <input v-validate data-vv-rules="required" type="radio" name="deactivation" :value="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-model.trim="deshabilitacion.IDEN_MOTIVO_DESHABILITACION"> {{deactivationreason.NOMB_MOTIVO_DESHABILITACION}}
                        </label>
                      </div>
                    </div>
                    <small class="text-danger" v-show="errors.has('deactivation')">{{ errors.first('deactivation') }}</small>
                    <div class="form-group margin-top">
                      <label for="denounceComment">Más detalles</label>
                      <textarea 
                        class="form-control"
                        :rows="5"
                        v-validate data-vv-rules="required|min:5|max:255"
                        name="description"
                        v-model.trim="deshabilitacion.DESC_COMENTARIO">
                      </textarea>
                      <span :class="deshabilitacion.DESC_COMENTARIO.length > 255 || deshabilitacion.DESC_COMENTARIO.length < 5 ? 'text-danger' : ''">{{deshabilitacion.DESC_COMENTARIO.length}} de 255 caracteres</span>
                    </div>
                    <small class="text-danger" v-show="errors.has('description')">{{ errors.first('description') }}</small>
                    <small class="text-danger" v-show="error.length">{{ error }}</small>
                    <div>
                      <button type="submit" class="btn btn-default">Enviar</button>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Volver</button>
                </div>
              </div>
            </div>
          </div> <!-- /disable modal -->     
        </div>
      </div>
    </div><!-- /container -->
  </section><!-- /Tabla Publicaciones -->
</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/admin/clients'
import controllerDeactivations from '~/controllers/admin/deactivationreasons'
import controllerAccountDisable from '~/controllers/admin/accountdisable'
import emailer from '~/controllers/admin/emailer'
import moment from 'moment'
import custompaginator from '~/controllers/custompaginator'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ clients }) => {
        return controllerDeactivations.GETAll(app)
          .then(({ deactivationreasons }) => {
            return custompaginator.paginate(clients)
              .then(({ paginatedData }) => {
                let pages = paginatedData.length
                return {
                  clients,
                  deactivationreasons,
                  paginatedData,
                  pages
                }
              })
          })
      })
  },
  data () {
    return {
      clients: [],
      search: '',
      postsAux: [],
      deactivationreasons: [],
      deshabilitacion: { DESC_COMENTARIO: '' },
      error: '',
      pagination: 0,
      pages: 0,
      paginatedData: [],
      processing: false,
      enabled: false
    }
  },
  methods: {
    check () {
      if (this.deactivationreasons.length === 0) {
        this.$notify.warning('Aún no se han agregado razones de deshabilitación.')
      } else {
        this.enabled = true
      }
    },
    async setState (client) {
      if (client.usuario.FLAG_BAN) {
        if (this.processing) return
        this.processing = true
        let data = await controllerAccountDisable.GETByUser(this, client)
        if (data) {
          let deshabilitacionUsuario = data.deshabilitacionUsuario
          deshabilitacionUsuario.FLAG_VIGENTE = false // Se habilita nuevamente el usuario, dejando como no vigente su ultima deshabilitacion.
          await controllerAccountDisable.PUT(this, deshabilitacionUsuario)
          await controller.setState(this, client)
          this.processing = false
        }
      }
    },
    buscarCliente () {
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
    },
    validateDisable () {
      this.$validator.validateAll().then(async (result) => {
        if (this.processing) return
        this.processing = true
        if (result) {
          let data = await controllerAccountDisable.POST(this)
          if (data.disabled) {
            let mail = this.deshabilitacion.client.usuario.EMAIL_USUARIO
            let razon = this.deshabilitacion.DESC_COMENTARIO
            let dat = await controller.setState(this, this.deshabilitacion.client)
            if (dat.disabled) {
              emailer.sendMail(this, mail, 'Usuario Baneado',
                'Estimado: Le informamos que su cuenta fue baneada por el siguiente motivo: ' + razon + '. Le rogamos ponerse en contacto con el administrador.')
                .then(() => {
                  this.deshabilitacion = { DESC_COMENTARIO: '' }
                  // Esconde el modal.
                  this.$refs.modalDismiss.click()
                  this.processing = false
                })
            } else {
              this.processing = false
            }
          } else {
            this.processing = false
          }
        } else {
          this.processing = false
        }
      })
    }
  },
  filters: {
    dateFormat: function (date) {
      return moment(String(date)).format('DD/MM/YYYY')
    }
  },
  computed: mapGetters([
    'loggedUser',
    'isAuthenticated'
  ]),
  middleware: 'authenticated',
  head () {
    return {
      title: 'Moderar Clientes',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
