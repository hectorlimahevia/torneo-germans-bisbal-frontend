<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'

const categories = ['SUB6', 'SUB8', 'SUB10', 'SUB12']

const selectedCategory = ref('SUB6')
const standings = ref([])
const error = ref('')

async function loadStandings() {
  try {
    const response = await api.get(`/api/standings/${selectedCategory.value}`)
    standings.value = response.data
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo cargar la clasificación'
  }
}
onMounted(loadStandings)

</script>

<template>
  <label for="category">
    Categoría:
  </label>

  <select
    id="category"
    v-model="selectedCategory"
    @change="loadStandings"
  >
    <option
      v-for="category in categories"
      :key="category"
      :value="category"
    >
      {{ category }}
    </option>
  </select>

  <p v-if="error">
    {{ error }}
  </p>
<div class="table-container">
  <table v-if="standings.length">
  <thead>
    <tr>
      <th>Pos</th>
      <th>Equipo</th>
      <th>PJ</th>
      <th>G</th>
      <th>E</th>
      <th>P</th>
      <th>TF</th>
      <th>TC</th>
      <th>Dif</th>
      <th>Pts</th>
    </tr>
  </thead>
  <tbody>
  <tr
    v-for="team in standings"
    :key="team.teamId"
  >
    <td>{{ team.rankPosition }}</td>
    <td>{{ team.teamName }}</td>
    <td>{{ team.played }}</td>
    <td>{{ team.won }}</td>
    <td>{{ team.drawn }}</td>
    <td>{{ team.lost }}</td>
    <td>{{ team.triesFor }}</td>
    <td>{{ team.triesAgainst }}</td>
    <td>{{ team.triesDifference }}</td>
    <td>{{ team.totalPoints }}</td>
  </tr>
</tbody>
</table>
</div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  margin-top: 2em;
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  background: white;
}

th,
td {
  padding: 5px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background: #f0f0f0;
}

td:nth-child(2),
th:nth-child(2) {
  text-align: left;
}
</style>
