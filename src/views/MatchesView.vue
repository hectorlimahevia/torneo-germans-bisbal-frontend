<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api'
import CategoryTabs from '../components/CategoryTabs.vue'

const matches = ref([])
const error = ref('')
const categories = ['SUB6', 'SUB8', 'SUB10', 'SUB12']
const selectedCategory = ref('SUB6')

const filteredMatches = computed(() => {
  return matches.value.filter(
    (match) => match.localTeam.category === selectedCategory.value,
  )
})

async function loadMatches() {
  try {
    const response = await api.get('/api/matches')
    matches.value = response.data
  } catch (err) {
    console.error(err)
    error.value = 'Could not load matches'
  }
}
onMounted(loadMatches)
</script>

<template>
  <section>
    <h2>Matches</h2>

    <p v-if="error">
  {{ error }}
</p>

<CategoryTabs
  :categories="categories"
  :selected-category="selectedCategory"
  @category-selected="selectedCategory = $event"
/>

<div
  v-for="match in filteredMatches"
  :key="match.id"
  class="match-card"
>
  <div class="match-top">
  <div>
    <strong>{{ match.field.name }}</strong>
    <p>{{ match.startTime }} - {{ match.endTime }}</p>
  </div>

  <span class="status-badge">
    {{ match.status }}
  </span>
</div>

<div class="match-teams">
  <div class="team">
    <img
      :src="match.localTeam.club.logoUrl"
      :alt="match.localTeam.club.name"
    >
    <span>{{ match.localTeam.name }}</span>
  </div>

  <div class="score">
    {{ match.localTries }} - {{ match.visitorTries }}
  </div>

  <div class="team">
    <img
      :src="match.visitorTeam.club.logoUrl"
      :alt="match.visitorTeam.club.name"
    >
    <span>{{ match.visitorTeam.name }}</span>
  </div>
</div>

<div class="match-bottom">
  <span>Round {{ match.roundNumber }}</span>
  <span>{{ match.matchDate }}</span>
</div>
</div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px;
  border: 1px solid var(--border);
}

.match-card h3 {
  margin: 0 0 12px;
  color: var(--primary);
  font-size: 18px;
}

.match-card p {
  margin: 6px 0;
  color: var(--text-secondary);
}

.match-header,
.match-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.match-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  font-weight: 700;
}

.team img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.match-top,
.match-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-top strong {
  color: var(--primary);
  font-size: 16px;
}

.match-top p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.status-badge {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.score {
  background: var(--primary);
  color: white;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 22px;
  font-weight: 900;
  white-space: nowrap;
}

.match-bottom {
  border-top: 1px solid var(--border);
  padding-top: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
