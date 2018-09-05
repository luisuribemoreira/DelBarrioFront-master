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
