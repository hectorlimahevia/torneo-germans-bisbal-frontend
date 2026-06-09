<template>
  <header class="app-header">
    <h1>Torneo UES</h1>

    <nav class="app-nav">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/standings">Clasificación</RouterLink>
      <RouterLink to="/matches">Partidos</RouterLink>
      <RouterLink to="/teams">Equipos</RouterLink>
      <RouterLink to="/rules">Reglas</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/ai">IA</RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  padding: 16px;
  background: #123c69;
  color: white;
}

.app-header h1 {
  margin: 0 0 12px;
  font-size: 22px;
}

.app-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.app-main {
  padding: 16px;
}

/* Tablet / escritorio */
@media (min-width: 768px) {
  .app-header {
    padding: 20px 32px;
  }

  .app-nav {
    flex-direction: row;
    gap: 16px;
  }

  .app-main {
    padding: 32px;
  }
}
</style>
