<template>
  <div>
    <section id="busqueda" class="container-fluid">
      <div class="container">
        <h4>Búsqueda avanzada</h4>
        <form class="margin-top">
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="buscas">¿Qué Buscas?</label>
                <input type="text" class="form-control" placeholder="Buscar Nombre de Producto o Servicio..." v-model="search.find" required>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group pricerange">
                <label for="rangodeprecio" class="col-sm-12">Rango de precio {{search.minPrice}} </label>
                <div class="col-sm-6">
                  <div class="input-group mb-2 mb-sm-0">
                    <div class="input-group-addon">$</div>
                    <input type="number" class="form-control" placeholder="Desde" name="min" v-model="search.minPrice">
                  </div>
                </div>
                <div class="col-sm-6 margin-top-responsive-20">
                  <div class="input-group mb-2 mb-sm-0">
                    <div class="input-group-addon">$</div>
                    <input type="number" class="form-control" placeholder="Hasta">
                  </div>                      
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <label for="tipo" class="margin-top-20">Tipo</label>
              <div class="btn-group tipo-checkbox" style="width:100%">
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" name="product" v-model="type.product" style="opacity:0">
                  <icon label="Check">
                    <icon name="square" style="color: #fff"></icon>
                    <icon v-if="type.product" name="check" class="text-checkbox"></icon>
                  </icon>
                  <span> Producto</span>
                </label>
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" v-model="type.service">
                  <icon label="Check">
                    <icon name="square" style="color: #fff"></icon>
                    <icon v-if="type.service" name="check" class="text-checkbox"></icon>
                  </icon>
                  <span> Servicio</span>
                </label>
                <label class="btn btn-info col-sm-4">
                  <input type="checkbox" autocomplete="off" v-model="type.sale" >
                  <icon label="Check">
                    <icon name="square" style="color: #fff"></icon>
                    <icon v-if="type.sale" name="check" class="text-checkbox"></icon>
                  </icon>
                  <span> Oferta</span>
                </label>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="categoria" class="margin-top-20">Categoría</label>
                <select class="form-control">
                  <option>Seleccione una Categoría</option>
                  <option v-for="category in categories" :key="category.IDEN_CATEGORIA">{{category.NOMB_CATEGORIA}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-sm-12">
            <button type="submit" class="btn btn-default">
              <icon name="search"></icon> <span class="icon-text"> Buscar</span>
            </button>
          </div>
        </form><!-- /Formulario -->
      </div><!-- /container -->
    </section><!-- /Busqueda -->

    <section id="emprendedores" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <h2>Emprendedores</h2>
          </div>
          <div class="col-xs-12 margin-top">
            <carousel 
                    :navigationEnabled="true"
                    :loop="true"
                    paginationActiveColor="#89dbee"
                    paginationColor="#b2ebd1"
                    :paginationSize="5"
                    easing="linear"
                    :speed="300"
                    :perPageCustom="[[768, 1], [1024, 6]]"
                    :autoplay ="true"
                    :autoplayTimeout="5000"
                    :autoplayHoverPause = "true"
                    >
              <slide v-for="emprendedor in index.emprendedores" :key="emprendedor.IDEN_EMPRENDEDOR">
                <nuxt-link :to="'/emprendedores/'+emprendedor.IDEN_EMPRENDEDOR">
                  <img :src="emprendedor.imagen.URL_IMAGEN ? emprendedor.imagen.URL_IMAGEN : '/img/no-image.svg'" class="img-responsive">
                </nuxt-link>
              </slide>
            </carousel>
          </div>
        </div>
      </div><!-- /container -->
    </section><!-- /Emprendedores -->
    
    <section id="productos" class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <h2 class="no-margin-top">Publicaciones Destacadas</h2>
          </div>
      </div>
      <div class="row margin-top">
        <div class="row">
          <transition-group name="list" tag="div">
            <div class="col-md-2 col-sm-3 col-xs-6 post-item" v-for="post in index.publicaciones" :key="post.IDEN_PUBLICACION"  v-if="post.FLAG_VIGENTE">
              <nuxt-link :to="{ path: '/publicaciones/'+post.IDEN_PUBLICACION }">
                <img v-if="post.imagenes.length == 0" v-lazy="'/img/no-image.svg'" class="img-responsive" alt="">
                <img v-else v-lazy="imageUrl + post.imagenes[0].URL_IMAGEN" class="img-responsive" alt="">
              </nuxt-link>
              <h4 class="text-center">{{ post.NOMB_PUBLICACION }}</h4> 
              <p class="text-center">{{ post.DESC_PUBLICACION.substring(0,20) }}...</p>
              <h5 class="text-center">$ {{ post.NUMR_PRECIO.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }}</h5>
            </div>
          </transition-group>
        <!-- Productos -->
        </div><!-- /row -->
      </div><!-- /row -->
    </div><!-- /container -->
  </section><!-- /Producto -->

  </div>
</template>

<script>
import controller from '~/controllers/index'
import categoriescontroller from '~/controllers/admin/categories'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
      .then(index => {
        return categoriescontroller.GETAll(app)
          .then(categories => {
            return {
              categories: categories.categories,
              index: index.index
            }
          })
      })
  },
  data () {
    return {
      search: {
        minPrice: ''
      },
      type: {
        product: true,
        service: false,
        sale: false
      },
      imageUrl: process.env.imagesUrl
    }
  },
  head () {
    return {
      title: 'Búsqueda avanzada'
    }
  }
}
</script>
