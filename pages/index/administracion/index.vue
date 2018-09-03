<template>
  <div class="container">
    <h2>Listado De Reportes</h2>
    <p><i>* Las estadísticas son compiladas con los datos del último mes</i></p>
    <br/>
    <div class="row">
      <div class="col-md-4">
          <button type="submit" class="btn btn-default" @click="denunciasPublicaciones(), type = 'denuncias', reportTitle = 'Denuncias de Publicaciones'">Denuncias de Publicaciones</button>
      </div>
      <div class="col-md-4">
          <button type="submit" class="btn btn-default" @click="publicacionesAprobadas(), type = 'aprobadas', reportTitle = 'Publicaciones Aprobadas'">Publicaciones Aprobadas</button>
      </div>
      <div class="col-md-4">
          <button type="submit" class="btn btn-default" @click="publicacionesRechazadas(), type = 'rechazadas', reportTitle = 'Publicaciones Rechazadas'">Publicaciones Rechazadas</button>
      </div>
    </div>
    <div class="row mt-4" v-if="reportData.length > 0">
      <button type="submit" class="btn btn-default" style="margin-left: 0.9rem !important" @click="enviarPorCorreo()">Enviar Reporte por Correo</button>
      <div class="col-12 table-responsive">
        <h4 class="text-center">{{reportTitle}}</h4> <br/>
        <table class="table table-hover table-sm">
          <thead class="text-center">
            <tr>
              <th :key="header" v-for="header in headers">{{ header }}</th>
            </tr>
          </thead>
          <tbody class="text-center" :key="data.publicacion" v-for="data in paginatedData[pagination]">
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
        <nav aria-label="Page navigation">
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
        </nav> <!-- navegacion --> 
      </div>
    </div> <!-- Datos de reporte -->
  </div>
</template>

<script>
import controllerReporteria from '~/controllers/admin/reporteria'
import customPaginator from '~/controllers/custompaginator'
import controllerMyAccount from '~/controllers/admin/myaccount'
import { mapGetters } from 'vuex'

export default {
  methods: {
    async denunciasPublicaciones () {
      let data = await controllerReporteria.denunciasPublicaciones(this)
      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
        this.paginatedData = (await customPaginator.paginate(this.reportData, 5)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }
    },
    async publicacionesAprobadas () {
      let data = await controllerReporteria.publicacionesAprobadas(this)

      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
        this.paginatedData = (await customPaginator.paginate(this.reportData, 5)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }
    },
    async publicacionesRechazadas () {
      let data = await controllerReporteria.publicacionesRechazadas(this)

      if (data !== -1) {
        this.reportData = data.reportData
        this.headers = data.headers
        this.paginatedData = (await customPaginator.paginate(this.reportData, 5)).paginatedData
        this.pages = this.paginatedData.length
        this.pagination = 0
      }
    },
    async enviarPorCorreo () {
      this.user = (await controllerMyAccount.GET(this, this.isAuthenticated.id)).user
      controllerReporteria.sendPDF(this, this.reportData, this.headers, this.type)
    }
  },
  data () {
    return {
      open: false,
      selected: false,
      headers: [],
      reportData: [],
      textWeight: 'font-weight-bold',
      type: '',
      reportTitle: false,
      pagination: 0,
      pages: 0,
      paginatedData: [[]],
      user: {}
    }
  },
  computed: mapGetters([
    'isAuthenticated',
    'loggedUser'
  ]),
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
