<template>
<section class="container-fluid" id="admin-faq">
    <div class="container fondo-beige">
      <div class="row">
        <div class="col-xs-12">
          <h2 class="text-center">Emprendedores</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 margin-top">
          <nuxt-link :to="{ path: '/administracion/emprendedores/nuevo' }" class="btn btn-tabla"><icon name="plus"></icon> Agregar</nuxt-link>
        </div>
        <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 margin-top">
          <form class="input-group text-truncate">
            <input class="form-control" name="search" placeholder="Buscar" autocomplete="off" autofocus="autofocus" type="text">
            <div class="input-group-btn">
              <button class="btn btn-outline-success" type="submit"><icon name="search" :aria-hidden="true"></icon></button>
            </div>
          </form>
        </div>
      </div>
      <div class="row margin-top">
        <div class="col-xs-12 table-responsive">
          <table class="table table-hover table-condensed">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="entrepreneur.IDEN_CATEGORIA" v-for="entrepreneur in entrepreneurs">
                <td>
                  <icon :name="entrepreneur.usuario.FLAG_BAN ? 'times' : 'check'" :title="entrepreneur.FLAG_BAN ? 'Deshabilitado' : 'Habilitado'"></icon>
                </td>
                <td><nuxt-link :to="{ path: '/emprendedores/' + entrepreneur.IDEN_EMPRENDEDOR }">{{entrepreneur.DESC_NOMBRE_FANTASIA}}</nuxt-link></td>
                <td>
                  <nuxt-link :to="{ path: '/administracion/emprendedores/editar/'+entrepreneur.IDEN_EMPRENDEDOR }" class="btn btn-secondary">
                    <icon name="pencil-square-o" title="Editar"></icon>
                  </nuxt-link>
                  <a class="btn" :class="entrepreneur.usuario.FLAG_BAN ? 'btn-success' : 'btn-danger'" @click="setState(entrepreneur)" :title="entrepreneur.usuario.FLAG_BAN ? 'Deshabilitar' : 'Habilitar'">
                    <icon :name="entrepreneur.usuario.FLAG_BAN ? 'check' : 'times'"></icon>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
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
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import controller from '~/controllers/admin/entrepreneurs'

export default {
  asyncData ({ app }) {
    return controller.GETAll(app)
  },
  methods: {
    setState (entrepreneur) {
      controller.setState(this, entrepreneur)
    }
  },
  head () {
    return {
      title: 'Emprendedores'
    }
  }
}
</script>
