<template>
    <div>
        <!-- NAV CLIENTE REGISTRADO, 101: Cliente -->
        <nav id="navegacion" class="navbar navbar-light navbar-expand-md" v-if="isAuthenticated && loggedUser.rol === 101">
            <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png" style="width:137px;height:51px"/></a>
            <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="navbar-nav nav-fill w-25">
                    <li class="nav-item">
                        <a class="nav-link" href="/listado-emprendedores">Emprendedores</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/listado-productos">Publicaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/administracion/ofertas">Ofertas</a>
                    </li>
                </ul>
                
                <div class="mx-2 my-auto d-inline w-50">
                    <div class="input-group">
                        <input type="text" @keyup="searchItems()" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search.nombre">
                        <ul class="dropdown-menu" :style="items.length > 0 ? 'display: block;' : ''">
                          <li class="dropdown-item" v-for="item in items" :key="item.nombre + new Date().getTime()" @click="search = item, buscar()">
                            <i class="fa fa-search"></i> {{ item.nombre }} 
                          </li>
                        </ul>
                        <span class="input-group-append">
                        <button class="btn btn-outline-secondary border border-left-0" type="submit">
                            <i class="fa fa-search"></i>
                        </button>
                        </span>
                    </div>
                </div>

                <ul class="navbar-nav mr-auto nav-fill w-25">
                    <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" href="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</a>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</a>
                            </li>
                </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i></a>
                </li>
                </ul>
            </div>
        </nav>

        <!-- NAV EMPRENDEDOR, 102: Emprendedor -->
        <nav id="navegacion" class="navbar navbar-light navbar-expand-md" v-if="isAuthenticated && loggedUser.rol === 102">
            <div class="container">
            <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png" style="width:137px;height:51px"/></a>
            <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                
                <ul class="navbar-nav ml-auto nav-fill w-50">
                    <li class="nav-item">
                        <a class="nav-link" href="/listado-emprendedores">Emprendedores</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/listado-productos">Publicaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/administracion/publicaciones">Mis publicaciones</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/administracion/ofertas">Ofertas</a>
                    </li>
                </ul>

                <div class="mx-2 my-auto d-inline w-50">
                    <div class="input-group">
                        <input type="text" @keyup="searchItems()" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search.nombre">
                        <ul class="dropdown-menu" :style="items.length > 0 ? 'display: block;' : ''">
                          <li class="dropdown-item" v-for="item in items" :key="item.nombre + new Date().getTime()" @click="search = item, buscar()">
                            <i class="fa fa-search"></i> {{ item.nombre }} 
                          </li>
                        </ul>
                        <span class="input-group-append">
                        <button class="btn btn-outline-secondary border border-left-0" type="submit">
                            <i class="fa fa-search"></i>
                        </button>
                    </span>
                    </div>
                </div>

                <ul class="navbar-nav mr-auto nav-fill w-25">
                    <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" href="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</a>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" style="font-size:20px;"></i></a>
                    </li>
                </ul>

            </div>
            </div>
        </nav>

        <!-- NAV ADMINISTRADOR, 103: Administrador, 104: Super Administrador -->
        <nav id="navegacion" class="navbar navbar-expand-md navbar-light" v-if="isAuthenticated && (loggedUser.rol === 103 || loggedUser.rol === 104)">
            <div class="container">
            
             <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png" style="width:137px;height:51px"/></a>

            <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Vinculo Paginas -->
                <div class="collapse navbar-collapse justify-content-md-end" id="navbarSupportedContent">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/administracion/moderar-publicaciones">Publicaciones</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/administracion/moderar-ofertas">Ofertas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/administracion/denuncias">Denuncias</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/administracion/emprendedores">Emprendedores</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/administracion/clientes">Clientes</a>
                        </li>

                        <li v-if="loggedUser.rol === 104" class="nav-item">
                            <a class="nav-link" href="/administracion/administradores">Administradores</a>
                        </li>
                        <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" role="button"
                        :aria-haspopup="true" :aria-expanded="false">Administración <span class="caret"></span></a>
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion">Reportes</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion/categorias">Categorías</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion/rubros">Rubros</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion/razon-denuncia">Razón de denuncia</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion/razon-desactivacion">Razón de desactivación</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion/terminos-condiciones">Términos y condiciones</a>
                            </li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/administracion/preguntas-frecuentes">Preguntas Frecuentes</a>
                            </li>
                        </ul>
                        </li>
                        <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                    
                        <ul class="dropdown-menu">
                            <li class="dropdown-item">
                                <a class="nav-link" href="/configuracion-admin"><i class="fa fa-wrench" :aria-hidden="true"></i> Configuración</a>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <a class="nav-link" href="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</a>
                            </li>
                        </ul>

                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" style="font-size:20px;"></i></a>
                    </li>
                    </ul>
                </div>
        </div><!-- /.container -->
    </nav>

        <!-- NAV INVITADO -->
        <nav class="navbar navbar-expand-md navbar-light" id="navegacion" v-if="!isAuthenticated">
            <div class="container">
                <!-- Logo Providencia MENU -->
                <a class="navbar-brand" href="/"><img src="/img/logo-soyprovi2.png" style="width:137px;height:51px"/></a>
                
                <!-- Botton Menu Responsive -->
                <button class="navbar-toggler navbar-toggler-left" id="hamburger" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" :aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Buscador -->
                <div class="collapse navbar-collapse justify-content-md-center" id="navbarSupportedContent">
                  <div class="mx-2 my-auto d-inline">
                    <div class="input-group">
                        <input type="text" @keyup="searchItems()" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search.nombre">
                        <ul class="dropdown-menu" :style="items.length > 0 ? 'display: block;' : ''">
                          <li class="dropdown-item" v-for="item in items" :key="item.nombre + new Date().getTime()" @click="search = item, buscar()">
                            <i class="fa fa-search"></i> {{ item.nombre }} 
                          </li>
                        </ul>
                        <span class="input-group-append">
                          <button class="btn btn-outline-secondary border border-left-0" type="submit">
                              <i class="fa fa-search"></i>
                          </button>
                        </span>
                    </div>
                  </div>
                </div>

                <!-- Vinculo Paginas -->
                <div class="collapse navbar-collapse justify-content-md-end" id="navbarSupportedContent">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/listado-productos">Productos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/listado-emprendedores">Emprendedores</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/">Nosotros</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/registro">Registro</a>
                        </li>
                        <li class="nav-item">
                            <a class="btn btn-round btn-danger" href="/autenticar" >Ingresar</a>
                        </li>
                        <li class="nav-item"> 
                            <a class="nav-link" href="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" style="font-size:20px;"></i></a>
                        </li>
                    </ul>
                </div><!-- /.collapse-navbar -->

            </div><!-- /.container -->
            </nav>

    <nuxt/>
        <footer class="container-fluid">
            <div class="container">
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
      search: {},
      searchMenu: ''
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  methods: {
    async searchItems () {
      let posts = (await postController.GETAll(this)).posts
      let entrepreneurs = (await entrepreneurController.GETAll(this)).entrepreneurs
      // Se inicia con la lista limpia, para evitar duplicados y limpiarla si no hay nada en el buscador.
      this.items = []
      if (this.search.nombre && this.search.nombre.length > 0) {
        if (posts.length > 0) {
          let obj = { tipo: 'publicacion' }
          posts.forEach(post => {
            if (post.FLAG_VIGENTE && !post.FLAG_BAN && post.FLAG_VALIDADO) {
              if (post.NOMB_PUBLICACION.match(new RegExp(this.search.nombre, 'gi')) !== null) {
                obj.nombre = post.NOMB_PUBLICACION
                this.items.push(obj)
              }
            }
          })
        }

        if (entrepreneurs.length > 0) {
          let obj = { tipo: 'emprendedor' }
          entrepreneurs.forEach(entrepreneur => {
            if (entrepreneur.DESC_NOMBRE_FANTASIA.match(new RegExp(this.search.nombre, 'gi')) !== null) {
              obj.nombre = entrepreneur.DESC_NOMBRE_FANTASIA
              this.items.push(obj)
            }
          })
        }
        // Se ordenan los items encontrados por orden alfabetico
        this.items.sort(function (a, b) {
          return a.nombre.localeCompare(b.nombre, 'es', { numeric: true })
        })
      }
    },
    buscar () {
      this.items = []
      this.$router.push({ path: '/busqueda-avanzada?nombre=' + this.search.nombre + '&tipo=' + this.search.tipo })
      this.search = {}
    },
    logout () {
      controller.unsetToken()
      this.$router.push({ path: '/' })
    }
  }
}
</script>
