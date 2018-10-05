<template>
  <section id="publicacion" class="container-fluid" align="center">
<!-- ############################################################################### -->
<section class="home-slider section pt-0 pb-0">
    <div class="container-fluid">
        <div class="row" style="margin-right: 0px;margin-left: 0px;">
            <div class="col pl-0 pr-0">
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" data-interval="0">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img class="carousel-img d-block w-100" src="img/img-soyprovidencia/home-slider-1.jpg" alt="First slide">
                            <div class="carousel-caption text-left mb-5">
                                <h2 class="home-slider--h2 h2 mb-4">Bienvenido a la Comunidad de emprendedores de Providencia</h2>
                                <nuxt-link :to="{ path: '/listado-productos'}" class="btn btn-primary btn-primary__turquoise mb-2"  role="button">
                                Ir a publicaciones
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img class="carousel-img d-block w-100" src="img/img-soyprovidencia/home-slider-2.jpg" alt="Second slide">
                        </div>
                        <div class="carousel-item">
                            <img class="carousel-img d-block w-100" src="img/img-soyprovidencia/home-slider-3.jpg" alt="Third slide">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <!-- /slider -->
            </div>
        </div>
    </div>
</section>
<!-- /HOME-SLIDER -->


<section class="home-products section">
    <div class="container pt-5 pb-5">
        <div class="row mb-5">
            <div class="col">
                <h2 class="home-products--top-title h2 text-center text-white">Publicaciones</h2>
            </div>
        </div>
        <!-- /row 1 -->

        <div class="row">
            <div class="col">
                <div id="home-products--carousel" class="carousel slide" data-ride="carousel" data-interval="0">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <div class="row">
                                <div class="col-lg-3 col-sm-6" v-for="post in posts" :key="post.IDEN_PUBLICACION">
                                    <div class="card">
                                        <nuxt-link :to="'/publicaciones/' + post.IDEN_PUBLICACION" class="card-img-link">
                                          <img v-if="post.imagenes.length === 0" v-lazy="'/img/no-image.svg'" class="card-img-top" alt="">
                                          <img v-else v-lazy="imageUrl + post.imagenes[0].URL_IMAGEN" class="card-img-top" alt="">
                                        </nuxt-link>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ post.NOMB_PUBLICACION }}</h5>
                                            <p class="card-text">{{ post.DESC_PUBLICACION.length > 50 ?  post.DESC_PUBLICACION.substring(0, 50) + '...' : post.DESC_PUBLICACION }}</p>
                                            <hr>
                                            <p class="card-text card-price">{{ post.NUMR_PRECIO }}</p>
                                            <p class="card-text card-link">
                                              <nuxt-link :to="'/publicaciones/' + post.IDEN_PUBLICACION">Ver publicación</nuxt-link>
                                              </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- /Card -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Slider -->
            </div>
        </div>
        <!-- /row 2 -->
    </div>
</section>
<!-- /HOME-PRODUCTS -->


<section class="home-entrepreneur section">
    <div class="container">
        <div class="row mb-5">
            <div class="col">
                <h2 class="home-entrepreneur--top-title h2 text-center text-white">Emprendedores</h2>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div id="home-entrepreneur--carousel" class="carousel slide" data-ride="carousel" data-interval="0">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <div class="row">
                                <div class="col-md-4" v-for="entrepreneur in entrepreneurs" :key="entrepreneur.IDEN_EMPRENDEDOR">
                                    <div class="card">
                                        <nuxt-link :to="'/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR" class="card-img-link">
                                          <img v-if="!entrepreneur.imagen.URL_IMAGEN" v-lazy="'/img/no-image.svg'" class="card-img-top" alt="">
                                          <img v-else v-lazy="imageUrl + entrepreneur.imagen.URL_IMAGEN" class="card-img-top" alt="">
                                        </nuxt-link>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ entrepreneur.DESC_NOMBRE_FANTASIA }}</h5>
                                            <p class="card-text">{{ entrepreneur.DESC_EMPRENDEDOR.length > 80 ? entrepreneur.DESC_EMPRENDEDOR.substring(0, 80) + '...' : entrepreneur.DESC_EMPRENDEDOR }}</p>
                                            <hr>
                                            <p class="card-text card-link">
                                              <nuxt-link :to="'/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR">Ver emprendedor</nuxt-link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- /Card 1 -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Slider -->
            </div>
        </div>
        <!-- /row 2 -->
    </div>
</section>
<!-- /HOME-ENTREPRENEUR -->

  </section>
</template>

<script>
import controllerEntrepreneurs from '~/controllers/admin/entrepreneurs'
import controllerPosts from '~/controllers/posts'
import Numeral from 'numeral'
// Se debe importar el locale de numeral para que funcione, no es necesario llamarlo por lo que se desactiva el linter para la linea.
import es from 'numeral/locales/es' //eslint-disable-line

export default {
  async asyncData ({ app }) {
    // Se fija el locale a 'es' para que el punto delimite los miles y la coma los decimales
    Numeral.locale('es')
    // Se llama a todos los emprendedores y luego se filtran y se asignan al array entrepreneurs.
    let entrepreneurs = []
    let entrepreneursAux = (await controllerEntrepreneurs.GETAll(app)).entrepreneurs
    entrepreneursAux.forEach(entrepreneur => {
      // Se verifica que el emprendedor haya finalizado su creacion(Ya se logueo al menos 1 ves y completo todos sus datos)
      if (entrepreneur.usuario && entrepreneur.usuario.FECH_CREACION && !entrepreneur.usuario.FLAG_BAN) entrepreneurs.push(entrepreneur)
    })
    // Se ordenan por fecha, el mas nuevo primero.
    entrepreneurs.sort(function (a, b) {
      if (a.usuario.FECH_CREACION > b.usuario.FECH_CREACION) return -1
      if (a.usuario.FECH_CREACION < b.usuario.FECH_CREACION) return 1
      return 0
    })
    // Solo se dejan los primeros 3 emprendedores
    entrepreneurs = entrepreneurs.slice(0, 3)

    // Se llama a todas las publicaciones y luego se filtran y se asignan al array posts
    let posts = []
    let postsAux = (await controllerPosts.GETAll(app)).posts
    postsAux.forEach(post => {
      // Se verifica que el post no este baneado, este vigente y haya sido validado por un administrador.
      if (!post.FLAG_BAN && post.FLAG_VIGENTE && post.FLAG_VALIDADO && !post.emprendedor.usuario.FLAG_BAN) {
        // Se le da formato a los precios, '$ 0,0' produce: 1500 -> $ 1.500
        post.NUMR_PRECIO = Numeral(post.NUMR_PRECIO).format('$ 0,0')
        posts.push(post)
      }
    })

    // Se ordenan por fecha, la mas reciente primero.
    posts.sort(function (a, b) {
      if (a.FECH_CREACION > b.FECH_CREACION) return -1
      if (a.FECH_CREACION < b.FECH_CREACION) return 1
      return 0
    })
    // Solo se dejan las primeros 4 publicaciones
    posts = posts.slice(0, 4)

    return {
      posts,
      entrepreneurs
    }
  },
  data () {
    return {
      imageUrl: process.env.imagesUrl,
      terms: process.env.termsUrl,
      posts: [],
      entrepreneurs: []
    }
  },
  head () {
    return {
      title: 'Inicio'
    }
  }
}
</script>
