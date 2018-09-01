<template>
  <div class="container">
    <h2>Listado De Reportes</h2>
    <p><i>* Las estadísticas son compiladas con los datos del último mes</i></p>
    <br/>
    <div class="col-md-12 col-md-offset-3">
        <button type="submit" class="btn btn-default" @click="denunciasPublicaciones()">Denuncias de Publicaciones</button>
    </div>
    <br/>
    <div class="col-md-12 col-md-offset-3">
        <button type="submit" class="btn btn-default" @click="publicacionesAprobadas()">Publicaciones Aprobadas</button>
    </div>
    <br/>
    <div class="col-md-12 col-md-offset-3">
        <button type="submit" class="btn btn-default" @click="publicacionesRechazadas()">Publicaciones Rechazadas</button>
    </div>
    <br/><br/><br/>
    <div class="row margin-top" v-if="reportData.length > 0">
      <div class="col-12 table-responsive">
        <table class="table table-hover table-sm">
          <thead class="text-center">
            <tr>
              <th :key="header" v-for="header in headers">{{ header }}</th>
            </tr>
          </thead>
          <tbody class="text-center" :key="data.publicacion" v-for="data in reportData">
            <tr data-toggle="collapse" @click="selected = data[1], open = !open">
              <nuxt-link v-if="data[1]" :to="{ path: '/publicaciones/' + data[1]}">
                <td>Ir a la publicación</td>
              </nuxt-link>
              <td>{{data[1]}}</td>
              <td v-bind:class="[data[5] ? textWeight : '']"><icon v-if="data[5] && data[5].length > 0" name="angle-down"></icon>{{data[2]}}</td>
              <td>{{data[3]}}</td>
              <td>{{data[4]}}</td>
            </tr>
            <tr :id="data[1]" v-if="data[1] == selected && open" v-for="denuncia in data[5]" :key="denuncia[4]" style="font-size: 90%">
                <td>{{denuncia[1]}}</td>
                <td>{{denuncia[2]}}</td>
                <td>{{denuncia[3]}}</td>
                <td>{{denuncia[4]}}</td>
                <td>{{denuncia[5]}}</td>
            </tr>
          </tbody>
        </table>
      <!-- <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <span aria-label="Previous" v-on:click="pagination > 0 ? pagination-- : ''">
              <span class="page-link" :aria-hidden="true">&laquo;</span>
            </span>
          </li>
          <li class="page-item" v-bind:key="page" v-for="page in pages">
            <span class="page-link" v-bind:class="{ 'font-weight: bold' : pagination === page - 1 }" v-on:click="pagination = page - 1">{{ page }}</span>
          </li>
          <li class="page-item">
            <span aria-label="Next" v-on:click="pagination < paginatedData.length - 1 ? pagination++ : ''">
              <span class="page-link" :aria-hidden="true">&raquo;</span>
            </span>
          </li>
        </ul>
      </nav> --> <!-- navegacion --> 
      </div>
        </div>

  </div>
</template>

<script>
import controllerReporteria from '~/controllers/admin/reporteria'

export default {
  methods: {
    async denunciasPublicaciones () {
      let data = await controllerReporteria.denunciasPublicaciones(this)
      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
      }
    },
    async publicacionesAprobadas () {
      let data = await controllerReporteria.publicacionesAprobadas(this)

      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
      }
    },
    async publicacionesRechazadas () {
      let data = await controllerReporteria.publicacionesRechazadas(this)

      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
      }
    }
  },
  data () {
    return {
      open: false,
      selected: false,
      headers: [],
      reportData: [],
      textWeight: 'font-weight-bold'
    }
  },
  head () {
    return {
      title: 'Reportes',
      meta: [
        { hid: 'description', name: 'description', content: 'description' }
      ]
    }
  }
}
</script>
