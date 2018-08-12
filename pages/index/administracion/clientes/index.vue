<template>
  <section id="admin-faq" class="container-fluid">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Clientes</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-offset-8 col-sm-6 col-sm-offset-3 margin-top">
          <div class="input-group text-truncate">
            <input class="form-control" name="search" v-model="search" placeholder="Buscar por Nombres o Apellidos del Cliente..." autocomplete="off" autofocus="autofocus" type="text" @keyup="buscarCliente()">
            <div class="input-group-btn">
              <icon name="search" :aria-hidden="true"></icon>
            </div>
          </div>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-hover table-condensed">
            <thead>
              <tr>
                <th>Estado</th>  
                <th>E-mail</th>
                <th>Nombre</th>
                <th>Fecha de nacimiento</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="client.IDEN_PERSONA" v-for="client in clients">
                <td><icon :name="client.usuario.FLAG_BAN ? 'times' : 'check'" :title="client.usuario.FLAG_BAN ? 'Deshabilitado' : 'Habilitado'"></icon></td>
                <td>{{client.usuario.EMAIL_USUARIO}}</td>
                <td>{{client.NOMBRES + ' ' + client.APELLIDO_PATERNO+ ' ' +client.APELLIDO_MATERNO}}</td>
                <td>{{client.FECH_FECHA_NACIMIENTO | dateFormat }}</td>
                <td>
                  <a class="btn"  @click="setState(client)">
                  <button class="btn btn-tabla" v-if="client.usuario.FLAG_BAN">Habilitar</button>
                  <button class="btn btn-tabla" v-if="!client.usuario.FLAG_BAN" data-toggle="modal" :data-target= "isAuthenticated ? '#disableModal' : ''" @click="deshabilitacion.client = client ">Deshabilitar</button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table><!-- /tabla -->
                      
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li>
                <a href="#" aria-label="Previous">
                  <span :aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li>
                <a href="#" aria-label="Next">
                  <span :aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        <!-- /paginacion -->

          <div class="modal fade" id="disableModal" v-if="isAuthenticated" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Deshabilitar Cliente</h4>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="validateDisable()">
                    <h5>Selecciona el motivo de deshabilitación</h5>
                    <div class="form-group" :key="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-for="deactivationreason in deactivationreasons">
                      <div class="radio">
                        <label>
                          <input v-validate data-vv-rules="required" type="radio" name="deactivation" :value="deactivationreason.IDEN_MOTIVO_DESHABILITACION" v-model="deshabilitacion.IDEN_MOTIVO_DESHABILITACION"> {{deactivationreason.NOMB_MOTIVO_DESHABILITACION}}
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
                        v-model="deshabilitacion.DESC_COMENTARIO">
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
import moment from 'moment'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(({ clients }) => {
        return controllerDeactivations.GETAll(app)
          .then(({ deactivationreasons }) => {
            return {
              clients,
              deactivationreasons
            }
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
      error: ''
    }
  },
  methods: {
    setState (client) {
      if (client.usuario.FLAG_BAN) {
        controllerAccountDisable.GETByUser(this, client)
          .then(({ deshabilitacionUsuario }) => {
            deshabilitacionUsuario.FLAG_VIGENTE = false // Se habilita nuevamente el usuario, dejando como no vigente su ultima deshabilitacion.
            controllerAccountDisable.PUT(this, deshabilitacionUsuario)
              .then(() => {
                controller.setState(this, client)
              })
          })
      }
    },
    buscarCliente () {
      // Copiar todos los clientes, si existen, a una variable auxiliar para no perder la lista original
      if (this.postsAux.length === 0) {
        this.postsAux = this.clients
      }

      // Si hay algo escrito en el buscador...
      if (this.search.length > 0) {
        // Se buscan todos los clientes en que el nombre, apellidos o parte de ellos posea el texto escrito en el buscador
        let cadena = this.search.trim().split(' ')
        let postAux = this.postsAux.map(client => {
          for (let i = 0; i < cadena.length; i++) {
            let palabraBusqueda = new RegExp(cadena[i], 'gi')
            if (client.NOMBRES.match(palabraBusqueda) || client.APELLIDO_PATERNO.match(palabraBusqueda) ||
                client.APELLIDO_MATERNO.match(palabraBusqueda)) return client
          }
        })

        // Limpia los clientes actuales y lo llena con los clientes que cumplan el criterio de busqueda
        this.clients = []
        postAux.forEach(client => {
          if (client) this.clients.push(client)
        })

        // Ordena los Clientes en orden lexicografico.
        this.clients.sort(function (a, b) {
          return a.NOMBRES.localeCompare(b.NOMBRES)
        })
      }

      // Si no hay texto en el buscador se restaura la lista original
      if (this.search.length === 0) {
        this.clients = this.postsAux
      }
    },
    validateDisable () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          controllerAccountDisable.POST(this)
            .then(() => {
              controller.setState(this, this.deshabilitacion.client)
              this.deshabilitacion = { DESC_COMENTARIO: '' }
            })
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
