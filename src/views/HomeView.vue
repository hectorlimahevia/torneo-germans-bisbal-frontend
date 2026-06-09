<template>
  <section class="home">
    <h1>Torneo Germans Bisbal UES</h1>

    <p>
      Frontend en Vue.js conectado a una API REST en Spring Boot para gestionar
      un torneo de rugby base.
    </p>

    <div class="links">
      <RouterLink to="/standings">Ver clasificación</RouterLink>
      <RouterLink to="/matches">Ver partidos</RouterLink>
      <RouterLink to="/teams">Ver equipos</RouterLink>
      <RouterLink to="/ai">Preguntar a la IA</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
