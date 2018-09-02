<template>
    <div>
        <!-- NAV CLIENTE REGISTRADO, 101: Cliente -->
        <nav id="navegacion" class="navbar navbar-dark  bg-dark navbar-expand-md" v-if="isAuthenticated && loggedUser.rol === 101">
            <a href="/" class="navbar-brand">DelBarrio</a>   
            <!-- Brand and toggle get grouped for better mobile display -->
            <button type="button" class="navbar-toggler collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" :aria-expanded="false"> 
                <span class="sr-only">Toggle navigation</span>
            &#x2630;</button>
            <!-- Collect
            the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="navbar-nav nav-fill w-25">
                    <li class="nav-item">
                        <nuxt-link to="/">
                            <icon name="home" :aria-hidden="true"></icon>
                        </nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/listado-emprendedores">Emprendedores</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/listado-productos">Publicaciones</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/ofertas">Ofertas</nuxt-link>
                    </li>
                </ul>
                
                <form class="mx-2 my-auto d-inline w-50">
                    <div class="input-group">
                        <input type="text" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search">
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
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <nuxt-link to="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</nuxt-link>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <nuxt-link to="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</nuxt-link>
                            </li>
                </ul>
                </li>
                <li class="nav-item">
                    <nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i>
                    </nuxt-link>
                </li>
                </ul>
            </div>
        </nav>

        <!-- NAV EMPRENDEDOR, 102: Emprendedor -->
        <nav id="navegacion" class="navbar navbar-dark  bg-dark navbar-expand-md" v-if="isAuthenticated && loggedUser.rol === 102">
            <a href="/" class="navbar-brand">DelBarrio</a>
            <!-- Brand and toggle get grouped for better mobile display -->
            <button type="button" class="navbar-toggler collapsed" data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1" :aria-expanded="false"> <span class="sr-only">Toggle navigation</span></button>
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                
                <ul class="navbar-nav ml-auto nav-fill w-50">
                    <li class="nav-item">
                        <nuxt-link to="/"><i class="fa fa-home" :aria-hidden="true"></i>
                        </nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/listado-emprendedores">Emprendedores</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/listado-productos">Publicaciones</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/publicaciones">Mis publicaciones</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/ofertas">Ofertas</nuxt-link>
                    </li>
                </ul>

                <form class="mx-2 my-auto d-inline w-50">
                    <div class="input-group">
                        <input type="text" class="form-control border border-right-0" placeholder="Buscar en el sitio..." autocomplete="off" autofocus="autofocus" v-model="search">
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
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <nuxt-link to="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</nuxt-link>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <nuxt-link to="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</nuxt-link>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i>
                        </nuxt-link>
                    </li>
                </ul>

            </div>
        </nav>

        <!-- NAV ADMINISTRADOR, 103: Administrador, 104: Super Administrador -->
        <nav id="navegacion" class="navbar navbar-dark  bg-dark navbar-expand-md" v-if="isAuthenticated && (loggedUser.rol === 103 || loggedUser.rol === 104)">
            <a href="/" class="navbar-brand">DelBarrio</a>
            <button type="button" class="navbar-toggler collapsed" data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1" :aria-expanded="false"> <span class="sr-only">Toggle navigation</span></button>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="navbar-nav ml-auto w-25">
                    <li class="nav-item">
                        <nuxt-link to="/"><i class="fa fa-home" :aria-hidden="true"></i>
                        </nuxt-link>
                    </li>
                </ul>

                <ul class="navbar-nav mx-auto nav-fill w-50 h-50">
                    <li class="nav-item">
                        <nuxt-link to="/administracion/moderar-publicaciones">Publicaciones</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/moderar-ofertas">Ofertas</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/denuncias">Denuncias</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/emprendedores">Emprendedores</nuxt-link>
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/administracion/clientes">Clientes</nuxt-link>
                    </li>

                    <li v-if="loggedUser.rol === 104" class="nav-item">
                        <nuxt-link to="/administracion/administradores">Administradores</nuxt-link>
                    </li>
                </ul>

                <ul class="navbar-nav mr-auto nav-fill w-25">
                    
                    <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" role="button"
                        :aria-haspopup="true" :aria-expanded="false">Administración <span class="caret"></span></a>
                        <ul
                        class="dropdown-menu">
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion">Reportes</nuxt-link>
                            </li>
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion/categorias">Categorías</nuxt-link>
                            </li>
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion/rubros">Rubros</nuxt-link>
                            </li>
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion/razon-denuncia">Razón de denuncia</nuxt-link>
                            </li>
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion/razon-desactivacion">Razón de desactivación</nuxt-link>
                            </li>
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion/terminos-condiciones">Términos y condiciones</nuxt-link>
                            </li>
                            <li class="dropdown-item">
                                <nuxt-link to="/administracion/preguntas-frecuentes">Preguntas Frecuentes</nuxt-link>
                            </li>
                        </ul>
                    </li>

                    <li class="dropdown nav-item"> <a href="#" class="dropdown-toggle usuario nav-link" data-toggle="dropdown"
                        role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                    
                        <ul class="dropdown-menu">
                            <li class="dropdown-item">
                                <nuxt-link to="/configuracion-admin"><i class="fa fa-wrench" :aria-hidden="true"></i> Configuración</nuxt-link>
                            </li>
                            <li role="separator" class="divider dropdown-item"></li>
                            <li class="dropdown-item">
                                <nuxt-link to="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</nuxt-link>
                            </li>
                        </ul>

                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i>
                        </nuxt-link>
                    </li>
                </ul>
            </div>
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
                    <form class="form-inline my-2 my-lg-0" action="#">
                        <input class="form-control mr-sm-2" type="text" placeholder="Buscar Producto">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </form>
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
      search: ''
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
  methods: {
    logout () {
      controller.unsetToken()
      this.$router.push({ path: '/' })
    }
  }
}
</script>
