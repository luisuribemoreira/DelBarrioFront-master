<template>
    <div>
        <!-- NAV CLIENTE REGISTRADO, 101: Cliente -->
        <nav id="navegacion" class="navbar navbar-light navbar-expand-md" v-if="isAuthenticated && loggedUser.rol === 101">
          <div class="container">
            <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png"/></a>
            <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse justify-content-md-end" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'ListadoEmprendedores'}" href="/listado-emprendedores">Emprendedores</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'ListadoProductos'}" href="/listado-productos">Publicaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'Ofertas'}" href="/ofertas">Ofertas</a>
                    </li>
                </ul>

                <form class="mx-2 my-auto d-inline w-50" @submit.prevent v-on:submit="search.tipo = undefined, buscar()">
                    <div class="input-group">
                        <input ref="searchInput" type="text" @keyup="searchItems()" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search.nombre">
                        <ul class="dropdown-menu" :style="items.length > 0 ? 'display: block;' : ''">
                          <li class="dropdown-item" tabIndex="-1" :ref="item.id" :class='{"active": currentItem === item.id}' v-for="item in items" :key="item.id" @click="search = item, buscar()">
                            <i class="fa fa-search"></i> {{ item.nombre }}
                          </li>
                        </ul>
                        <span class="input-group-append">
                        <button class="btn btn-outline-secondary border border-left-0" type="submit">
                            <i class="fa fa-search"></i>
                        </button>
                    </span>
                    </div>
                </form>

                <ul class="navbar-nav mr-auto nav-fill w-25">
                    <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'MiCuenta'}" href="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</a>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/sign-out"><i class="fa fa-sign-out-alt" :aria-hidden="true"></i> Cerrar Sesión</a>
                            </li>
                </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" v-bind:class="{active: getTitle === 'PreguntasFrecuentes'}" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fas fa-question-circle" :aria-hidden="true"></i></a>
                </li>
                </ul>
            </div>
          </div>
        </nav>

        <!-- NAV EMPRENDEDOR, 102: Emprendedor -->
        <nav id="navegacion" class="navbar navbar-expand-md navbar-light" v-if="isAuthenticated && loggedUser.rol === 102">
            <div class="container">
            <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png"/></a>
            <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

            <div class="collapse navbar-collapse justify-content-md-end" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'ListadoEmprendedores'}" href="/listado-emprendedores">Emprendedores</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'ListadoProductos'}" href="/listado-productos">Publicaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'MisPublicaciones'}" id ="nowrap" href="/administracion/publicaciones">Mis publicaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'Ofertas'}" href="/ofertas">Ofertas</a>
                    </li>
                </ul>

                <form class="mx-2 my-auto d-inline w-50" @submit.prevent v-on:submit="search.tipo = undefined, buscar()">
                    <div class="input-group">
                        <input ref="searchInput" type="text" @keyup="searchItems()" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search.nombre">
                        <ul class="dropdown-menu" :style="items.length > 0 ? 'display: block;' : ''">
                          <li class="dropdown-item" tabIndex="-1" :ref="item.id" :class='{"active": currentItem === item.id}' v-for="item in items" :key="item.id" @click="search = item, buscar()">
                            <i class="fa fa-search"></i> {{ item.nombre }}
                          </li>
                        </ul>
                        <span class="input-group-append">
                        <button class="btn btn-outline-secondary border border-left-0" type="submit">
                            <i class="fa fa-search"></i>
                        </button>
                    </span>
                    </div>
                </form>

                <ul class="navbar-nav mr-auto nav-fill w-25">
                    <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'MiCuenta'}" href="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</a>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/sign-out"><i class="fa fa-sign-out-alt" :aria-hidden="true"></i> Cerrar Sesión</a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'PreguntasFrecuentes'}" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fas fa-question-circle" style="font-size:20px;"></i></a>
                    </li>
                </ul>

            </div>
            </div>
        </nav>

        <!-- NAV ADMINISTRADOR, 103: Administrador, 104: Super Administrador -->
        <nav id="navegacion" class="navbar navbar-expand-md navbar-light" v-if="isAuthenticated && (loggedUser.rol === 103 || loggedUser.rol === 104)">
            <div class="container">

             <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png"/></a>

            <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Vinculo Paginas -->
                <div class="collapse navbar-collapse justify-content-md-end" id="navbarSupportedContent">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ModerarPublicaciones'}" href="/administracion/moderar-publicaciones">Publicaciones</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ModerarOfertas'}" href="/administracion/moderar-ofertas">Ofertas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'Denuncias'}" href="/administracion/denuncias">Denuncias</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ModerarEmprendedor'}" href="/administracion/emprendedores">Emprendedores</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ModerarCliente'}" href="/administracion/clientes">Clientes</a>
                        </li>

                        <li v-if="loggedUser.rol === 104" class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ModerarAdministrador'}" href="/administracion/administradores">Administradores</a>
                        </li>
                        <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" role="button"
                        :aria-haspopup="true" :aria-expanded="false">Administración <span class="caret"></span></a>
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'Reportes'}" href="/administracion">Reportes</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'Categorias'}" href="/administracion/categorias">Categorías</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'Rubros'}" href="/administracion/rubros">Rubros</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'RazonDenuncia'}" href="/administracion/razon-denuncia">Razón de denuncia</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'RazonDesactivacion'}" href="/administracion/razon-desactivacion">Razón de desactivación</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'TerminosCondiciones'}" href="/administracion/terminos-condiciones">Términos y condiciones</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'ModerarPreguntasFrecuentes'}" href="/administracion/preguntas-frecuentes">Preguntas Frecuentes</a>
                            </li>
                        </ul>
                        </li>
                        <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>

                        <ul class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" v-bind:class="{active: getTitle === 'ConfiguracionAdmin'}" href="/configuracion-admin"><i class="fa fa-wrench" :aria-hidden="true"></i> Configuración</a>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/sign-out"><i class="fa fa-sign-out-alt" :aria-hidden="true"></i> Cerrar Sesión</a>
                            </li>
                        </ul>

                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="{active: getTitle === 'PreguntasFrecuentes'}" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fas fa-question-circle" style="font-size:20px;"></i></a>
                    </li>
                    </ul>
                </div>
        </div><!-- /.container -->
    </nav>

        <!-- NAV INVITADO -->
        <nav class="navbar navbar-expand-lg navbar-light" id="navegacion" v-if="!isAuthenticated">
            <div class="container">
                <!-- Logo Providencia MENU -->
                <a class="navbar-brand mr-5" href="/"><img src="/img/logo-soyprovi2.png"/></a>

                <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Buscador -->
                <div class="collapse navbar-collapse justify-content-md-center" id="navbarSupportedContent">
                  <form class="mx-2 my-auto d-inline"  @submit.prevent v-on:submit="search.tipo = undefined, buscar()">
                    <div class="input-group">
                        <input ref="searchInput" type="text" @keyup="searchItems()" class="form-control border border-right-0" placeholder="Buscar..." autocomplete="off" v-model="search.nombre">
                        <ul class="dropdown-menu" :style="items.length > 0 ? 'display: block;' : ''">
                          <li class="dropdown-item" tabIndex="-1" :ref="item.id" :class='{"active": currentItem === item.id}' v-for="item in items" :key="item.id" @click="search = item, buscar()">
                            <i class="fa fa-search"></i> {{ item.nombre }}
                          </li>
                        </ul>
                        <span class="input-group-append">
                          <button class="btn btn-outline-secondary border border-left-0" type="submit">
                              <i class="fa fa-search"></i>
                          </button>
                        </span>
                    </div>
                  </form>
                </div>

                <!-- Vinculo Paginas -->
                <div class="collapse navbar-collapse justify-content-md-end" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ListadoProductos'}" href="/listado-productos">Publicaciones</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'ListadoEmprendedores'}" href="/listado-emprendedores">Emprendedores</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'Nosotros'}" href="/nosotros">Nosotros</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="{active: getTitle === 'Registro'}" href="/registro">Registrarme</a>
                        </li>
                        <li class="nav-item">
                            <a class="btn btn-round btn-round__turquoise text-white" v-bind:class="{active: getTitle === 'Nosotros'}" href="/autenticar" >Ingresar</a>
                        </li>
                        <li class="nav-item">
                           <no-ssr><a class="nav-link" href="/preguntas-frecuentes" v-bind:class="{active: getTitle === 'PreguntasFrecuentes'}" title="Preguntas frecuentes"><i class="fas fa-question-circle" style="font-size:20px;"></i></a></no-ssr>
                        </li>
                    </ul>
                </div><!-- /.collapse-navbar -->
            </div><!-- /.container -->
            </nav>

    <nuxt/>
        <footer class="footer">
    <div class="container">
      <div class="row justify-content-between align-items-center">
          <div class="col-sm-4 col-md-4 col-lg-3 ">
            <img style="width: 150px; height: 150px;" class="mx-auto d-block" src="/img/logos/hub.png" alt="">
          </div>
                <div class="col-sm-4 col-md-4 col-lg-6 text-center mr-auto ">
                    <p class="footer--top-text p text-white">Hub Providencia, Manuel Montt 101 | Providencia, Santiago de Chile | Mesa Central: +562 2654 3463</p>
                    <p class="footer--bottom-text p text-white">Horario General: Lunes a Viernes de 8:30 a 14:00 horas. | Encargado: Mauricio Brito | mbrito@providencia.cl</p>
                    <p class="footer--bottom--text p text-white"><a target="_blank" :href="terms" id="aTerms">Términos y Condiciones</a></p>
                    <p class="footer--bottom-text p text-white">Sitio desarrollado por Centro de Vinculación de Proyectos Académicos,<br> Duoc UC - Sede Antonio Varas</p>
                </div>
          <div class="col-sm-4 col-md-4 col-lg-3  mr-auto">
            <img class="mx-auto d-block img-fluid" src="/img/logos/LogoDuoc.png" alt="">
          </div>

      </div>
    </div>
  </footer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import controller from '~/controllers/auth.js'
import userController from '~/controllers/admin/myaccount'
import postController from '~/controllers/posts'
import entrepreneurController from '~/controllers/admin/entrepreneurs'

export default {
  data () {
    // Redirecciona a los emprendedores a su pagina de llenado de datos, en caso de no tenerlos aun.
    this.$router.afterEach((transition) => {
      if (this.isAuthenticated && this.loggedUser.rol === 102 && transition.path !== '/sign-out') {
        userController.GET(this, this.loggedUser.id)
          .then(({ user }) => {
            if (!user.FECH_CREACION && this.$router.currentRoute.fullPath !== '/registro-emprendedor') {
              this.$router.replace('/registro-emprendedor')
            } else if (user.FECH_CREACION && this.$router.currentRoute.fullPath === '/registro-emprendedor') {
              this.$router.replace('/')
            }
          })
      }
    })
    return {
      items: [],
      search: { nombre: '' },
      searchMenu: '',
      currentItem: 0,
      posts: [],
      entrepreneurs: [],
      terms: process.env.termsUrl
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser',
    'getTitle'
  ]),
  methods: {
    async searchItems () {
      if (this.posts.length === 0 && this.entrepreneurs.length === 0) {
        this.posts = (await postController.GETAll(this)).posts
        this.entrepreneurs = (await entrepreneurController.GETAll(this)).entrepreneurs
      }
      if (this.search.nombre && this.search.nombre.length > 0) {
        this.items = []
        if (this.items) {
          if (this.posts.length > 0) {
            this.posts.forEach(post => {
              if (post.FLAG_VIGENTE && !post.FLAG_BAN && post.FLAG_VALIDADO && !post.emprendedor.usuario.FLAG_BAN) {
                if (post.NOMB_PUBLICACION.match(new RegExp(this.search.nombre, 'gi')) !== null) {
                  this.items.push({
                    id: 0,
                    nombre: post.NOMB_PUBLICACION,
                    tipo: 'publicacion'
                  })
                }
              }
            })
          }

          if (this.entrepreneurs.length > 0) {
            this.entrepreneurs.forEach(entrepreneur => {
              if (entrepreneur.usuario && entrepreneur.usuario.FECH_CREACION && !entrepreneur.usuario.FLAG_BAN) {
                if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search.nombre, 'gi')) !== null) {
                  this.items.push({
                    id: 0,
                    nombre: entrepreneur.DESC_NOMBRE_FANTASIA,
                    tipo: 'emprendedor'
                  })
                }
              }
            })
          }
          // Se ordenan los items encontrados por orden alfabetico
          this.items.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre, 'es', { numeric: true })
          })
          // Se corta el arreglo despues de ordenarlo para que solo aparescan las primeras 10 coincidencias.
          this.items = this.items.slice(0, 10)
          for (let i = 0; i < this.items.length; i++) {
            // Asignar ids a los items
            this.items[i].id = i + 1
          }
          if (this.items.length > 0) document.addEventListener('keyup', this.siguienteItem)
        }
      } else {
        this.currentItem = 0
        this.items = []
        document.removeEventListener('keyup', this.siguienteItem)
      }
    },
    buscar () {
      this.items = []
      if (this.search.tipo) {
        this.$router.push({ path: '/busqueda-avanzada?nombre=' + this.search.nombre + '&tipo=' + this.search.tipo })
      } else {
        this.$router.push({ path: '/busqueda-avanzada?nombre=' + this.search.nombre + '&tipo=publicacion' })
      }
      this.search = {}
    },
    siguienteItem (event) {
      // Metodo para permitir la navegacion en los resultados con las flechas hacia arriba y abajo y el Enter.
      if (event.keyCode === 38 && this.currentItem === 1) {
        this.currentItem = 0
        this.$refs.searchInput.focus()
      } else if (event.keyCode === 38 && this.currentItem > 1) {
        this.currentItem--
        this.$refs[this.currentItem][0].focus()
      } else if (event.keyCode === 40 && this.currentItem < this.items.length) {
        this.currentItem++
        this.$refs[this.currentItem][0].focus()
      }
      if (event.keyCode === 13 && this.currentItem > 0 && this.items.length > 0) {
        this.$refs[this.currentItem][0].click()
      }
    },
    logout () {
      controller.unsetToken()
      this.$router.push({ path: '/' })
    }
  }
}
</script>
