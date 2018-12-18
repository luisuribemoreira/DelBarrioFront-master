<template>
<section>
    <section class="about-top section pt-0 pb-0"><!-- TOP -->
		<div class="container-fluid">
			<div class="row"></div>
		</div>
	</section><!-- /TOP -->
    <section class="about-info section"><!-- INFO -->
		<div class="container">
			<div class="row">
				<div class="col-lg-8 offset-lg-2 text-center">
					<h2 class="h2">Sobre nosotros</h2>
					<h3 class="h3">¿Quiénes somos?</h3>
					<p class="mt-4">
					Hub Providencia es una red de espacios colaborativos para el trabajo,
					perteneciente a la actual Dirección de Desarrollo Local de la Municipalidad de Providencia.
					Dentro de esta dirección se encuentra el Departamento de Emprendimiento,
					que busca potenciar y fomentar a los emprendedores a través de acciones de formación,
					capacitación, asesorías técnicas y activaciones comerciales para fortalecer los pequeños y medianos comerciantes de la comuna.</p>
					<h3 class="h3">¿Para qué?</h3>
					<p class="mt-4">
					Vitrina Providencia</p>
					<p class="mt-4">
					Esta plataforma de promoción de productos y servicios para emprendedoras de la comuna de Providencia, busca fomentar la
					vinculación comercial entre vecinos, emprendedores y empresas de la comuna.
					</p>
				</div>
			</div>
		</div>
	</section><!-- /INFO -->
    <section class="about-team section"><!-- TEAM -->
		<div class="container">
			<div class="row">
				<div class="col">
					<h2 class="h2 text-center">Equipo Hub Providencia</h2>
				</div>
			</div>

			<div class="text-center mt-3">
				<div class="gallery">
					<img src="img/img-soyprovidencia/group-photo.png" class="about-team--image img-fluid" alt="Grupo">
					<h5 class="about-team--title h5 mt-3">Team HUB Providencia</h5>
					<p class="about-team--text">Descripción</p>
				</div>
			</div>
			<!--imagen-->

		</div>
	</section><!-- /TEAM -->
</section>
</template>
<script>
export default {
  asyncData ({ store }) {
    store.commit('SET_TITLE', 'Nosotros')
  },
  head () {
    return {
      title: 'Nosotros'
    }
  }
}
</script>
