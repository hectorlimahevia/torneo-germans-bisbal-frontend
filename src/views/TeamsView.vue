<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'

const teams = ref([])
const error = ref('')

async function loadTeams() {
  try {
    const response = await api.get('/api/teams')
    teams.value = response.data
  } catch (err) {
  console.error(err)
  error.value = 'No se pudieron cargar los equipos'
}
}

onMounted(loadTeams)
</script>

<template>
  <section>
    <h2>Equipos</h2>

    <p v-if="error">{{ error }}</p>

    <div v-for="team in teams" :key="team.id" class="team-card">
      <h3>{{ team.name }}</h3>
      <p>Categoría: {{ team.category }}</p>
      <p>Club: {{ team.clubName || team.club?.name || 'Sin club' }}</p>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
}
</style>
