<template>
  <div>
    <header class="container-fluid">
        <div class="container">
            <div class="row">
                <div class="col-xs-6">
                    <nuxt-link to="/"><img v-bind:src="'/img/logo-del-barrio.png'" class="img-responsive" alt="Logo Del Barrio"></nuxt-link>
                </div>
                <div class="col-xs-6">
                    <a href="http://www.providencia.cl/infante1415"><img v-bind:src="'/img/logo-emprende.png'" class="img-responsive" alt="Logo Emprende" align="right"></a>
                </div>
            </div>
        </div>
    </header>
    <!-- /Headers-->
    <!-- NAV CLIENTE REGISTRADO, 101: Cliente -->
    <nav id="navegacion" class="navbar navbar-default" v-if="isAuthenticated && loggedUser.rol === 101">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" :aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-left">
                    <li><nuxt-link to="/"><icon name="home" :aria-hidden="true"></icon></nuxt-link></li>
                </ul>
                
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle usuario" data-toggle="dropdown" role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><nuxt-link to="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</nuxt-link></li>
                            <li role="separator" class="divider"></li>
                            <li><nuxt-link to="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</nuxt-link></li>
                        </ul>
                    </li>
                    <li><nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i></nuxt-link></li>
                </ul>
                <form class="input-group text-truncate">
                    <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text" v-model="search">
                    <div class="input-group-btn">
                        <button class="btn btn-outline-success" type="submit"><i class="fa fa-search" :aria-hidden="true"></i></button>
                    </div>
                </form>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>

    <!-- NAV EMPRENDEDOR, 102: Emprendedor -->
    <nav id="navegacion" class="navbar navbar-default" v-if="isAuthenticated && loggedUser.rol === 102">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" :aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-left">
                    <li><nuxt-link to="/"><i class="fa fa-home" :aria-hidden="true"></i></nuxt-link></li>
                </ul>
                
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle usuario" data-toggle="dropdown" role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><nuxt-link to="/mi-cuenta"><i class="fa fa-wrench" :aria-hidden="true"></i> Mi cuenta</nuxt-link></li>
                            <li role="separator" class="divider"></li>
                            <li><nuxt-link to="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</nuxt-link></li>
                        </ul>
                    </li>
                    <li><nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i></nuxt-link></li>
                </ul>
                <ul class="nav navbar-nav nav-admin">
                    <li><nuxt-link to="/administracion/publicaciones">Mis publicaciones</nuxt-link></li>
                    <li><nuxt-link to="/administracion/ofertas">Ofertas</nuxt-link></li>
                </ul>
                <form class="input-group text-truncate">
                    <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text" v-model="search">
                    <div class="input-group-btn">
                        <button class="btn btn-outline-success" type="submit"><i class="fa fa-search" :aria-hidden="true"></i></button>
                    </div>
                </form>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>

    <!-- NAV ADMINISTRADOR, 103: Administrador, 104: Super Administrador -->
    <nav id="navegacion" class="navbar navbar-default" v-if="isAuthenticated && (loggedUser.rol === 103 || loggedUser.rol === 104)">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" :aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-left">
                    <li><nuxt-link to="/"><i class="fa fa-home" :aria-hidden="true"></i></nuxt-link></li>
                </ul>
                
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle usuario" data-toggle="dropdown" role="button" :aria-haspopup="true" :aria-expanded="false">{{ loggedUser.nombre }} <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#"><i class="fa fa-wrench" :aria-hidden="true"></i> Configuración</a></li>
                            <li role="separator" class="divider"></li>
                            <li><nuxt-link to="/sign-out"><i class="fa fa-sign-out" :aria-hidden="true"></i> Cerrar Sesión</nuxt-link></li>
                        </ul>
                    </li>
                    <li><nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><i class="fa fa-question-circle" :aria-hidden="true"></i></nuxt-link></li>
                </ul>
                
                <ul class="nav navbar-nav nav-admin">
                    <li><nuxt-link to="/administracion/moderar-publicaciones">Publicaciones</nuxt-link></li>
                    <li><nuxt-link to="/administracion/denuncias">Denuncias</nuxt-link></li>
                    <li><nuxt-link to="/administracion/emprendedores">Emprendedores</nuxt-link></li>
                    <li><nuxt-link to="/administracion/clientes">Clientes</nuxt-link></li>
                    <li v-if="loggedUser.rol === 104"><nuxt-link to="/administracion/administradores">Administradores</nuxt-link></li>
                    <li class="dropdown">
                      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" :aria-haspopup="true" :aria-expanded="false">Administración <span class="caret"></span></a>
                      <ul class="dropdown-menu">
                          <li><nuxt-link to="/administracion">Reportes</nuxt-link></li>
                        <li><nuxt-link to="/administracion/categorias">Categorías</nuxt-link></li>
                        <li><nuxt-link to="/administracion/rubros">Rubros</nuxt-link></li>
                        <li><nuxt-link to="/administracion/razon-denuncia">Razón de denuncia</nuxt-link></li>
                        <li><nuxt-link to="/administracion/razon-desactivacion">Razón de desactivación</nuxt-link></li>
                        <li><nuxt-link to="/administracion/rubros">Rubros</nuxt-link></li>
                        <li><nuxt-link to="/administracion/terminos-condiciones">Términos y condiciones</nuxt-link></li>
                        <li><nuxt-link to="/administracion/preguntas-frecuentes">Preguntas Frecuentes</nuxt-link></li>
                      </ul>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>

    <!-- NAV INVITADO -->
    <nav id="navegacion" class="navbar navbar-default" v-if="!isAuthenticated">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" :aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-left">
                    <li><nuxt-link to="/"><i class="fa fa-home" :aria-hidden="true"></i></nuxt-link></li>
                </ul>
                
                <ul class="nav navbar-nav navbar-right">
                    <li><nuxt-link to="/autenticar">Inicia sesión</nuxt-link></li>
                    <li><nuxt-link to="/registro">Regístrate</nuxt-link></li>
                    <li><nuxt-link to="/preguntas-frecuentes" title="Preguntas frecuentes"><icon name="question-circle" :aria-hidden="true"></icon></nuxt-link></li>
                </ul>
                <form class="input-group text-truncate">
                    <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text" v-model="search">
                    <div class="input-group-btn">
                        <button class="btn btn-outline-success" type="submit"><icon name="search" :aria-hidden="true"></icon></button>
                    </div>
                </form>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>
    <breadcrumb/>
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

export default {
  data () {
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
