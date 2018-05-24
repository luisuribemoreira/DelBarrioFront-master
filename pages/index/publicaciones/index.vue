<template>
  <div>
    <section id="productos" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <h2>Productos</h2>
          </div>
        </div>
        <div class="row">
          <transition-group name="list" tag="div">
            <div class="col-md-2 col-sm-3 col-xs-6 post-item" v-for="p in posts" :key="p.IDEN_PUBLICACION">
              <nuxt-link :to="{ path: '/publicaciones/'+p.IDEN_PUBLICACION }">
                <img v-if="p.imagenes.length == 0" v-lazy="'/img/no-image.svg'" class="img-responsive" alt="">
                <img v-else v-lazy="'https://delbarrio.barrenechea.cl/'+p.imagenes[0].URL_IMAGEN" class="img-responsive" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ p.NOMB_PUBLICACION }}</h4> 
              <p class="text-center">{{ p.DESC_PUBLICACION.substring(0,20) }}</p>
              <h5 class="text-center">$ {{ p.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }} <small>C/U</small></h5>
            </div>
          </transition-group>
        <!-- Productos -->
        </div><!-- /row -->
        <nav aria-label="Navegación de páginas" style="text-align: center">
          <ul class="pagination">
            <li>
              <a v-if="pagination.page !== 1" href="#" aria-label="Previa">
                <span aria-hidden="true">&laquo;</span>
              </a>
              <a v-else aria-label="Previa" disabled="disabled">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li v-for="n in pagination.pageCount" :key="n">
              <a href="#" @click="switchPages(n)">{{ n }}</a>
            </li>
            <li>
              <a v-if="pagination.page !== pagination.pageCount" href="#" aria-label="Siguiente">
                <span aria-hidden="true">&raquo;</span>
              </a>
              <a v-else aria-label="Siguiente" disabled="disabled">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div><!-- /container -->
    </section><!-- /Producto -->
  </div>
</template>

<script>
import controller from '~/controllers/posts'
export default {
  data () {
    return {
      imageUrl: process.env.imagesUrl
    }
  },
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    switchPages (pageNumber) {
      event.preventDefault()
      controller.GETAll(this, pageNumber)
        .then(res => {
          this.$scrollTo('#productos')
          this.posts = res.posts
          this.pagination = res.pagination
        }).catch(err => {
          console.log(err)
        })
    }
  },
  head () {
    return {
      title: 'Publicaciones'
    }
  }
}
</script>

<style type="text/css">
a[disabled="disabled"] {
  cursor: not-allowed;
}
.list-enter-active {
  animation: fade-in .5s;
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>