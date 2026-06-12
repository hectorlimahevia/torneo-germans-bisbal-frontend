<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/api'
import { CATEGORIES } from '@/constants/categories.js'

const teams = ref([])
const fields = ref([])
const matches = ref([])
const selectedAdminTab = ref('create')
const updateCategory = ref('')

const error = ref('')
const success = ref('')
const selectedCategory = ref('')

const newMatch = ref({
  localTeamId: '',
  visitorTeamId: '',
  fieldId: '',
  matchDate: '',
  startTime: '',
  endTime: '',
  localTries: 0,
  visitorTries: 0,
  status: 'SCHEDULED',
  roundNumber: 1,
})

const newField = ref({
  name: '',
  location: '',
})

const selectedMatchId = ref('')

const matchUpdate = ref({
  localTries: 0,
  visitorTries: 0,
  status: 'FINISHED',
})

const filteredTeams = computed(() => {
  if (!selectedCategory.value) {
    return []
  }

  return teams.value.filter((team) => team.category === selectedCategory.value)
})

const visitorTeams = computed(() => {
  return filteredTeams.value.filter((team) => team.id !== newMatch.value.localTeamId)
})

const filteredMatches = computed(() => {
  if (!updateCategory.value) {
    return []
  }

  return matches.value.filter((match) => match.localTeam?.category === updateCategory.value)
})

function resetSelectedTeams() {
  newMatch.value.localTeamId = ''
  newMatch.value.visitorTeamId = ''
}

function resetUpdateForm() {
  selectedMatchId.value = ''

  matchUpdate.value = {
    localTries: 0,
    visitorTries: 0,
    status: 'FINISHED',
  }
}

async function loadData() {
  try {
    const [teamsResponse, fieldsResponse, matchesResponse] = await Promise.all([
      api.get('/api/teams'),
      api.get('/api/fields'),
      api.get('/api/matches'),
    ])

    teams.value = teamsResponse.data
    fields.value = fieldsResponse.data
    matches.value = matchesResponse.data
  } catch (err) {
    console.error(err)
    error.value = 'Could not load admin data'
  }
}

async function createMatch() {
  try {
    error.value = ''
    success.value = ''

    await api.post('/api/matches', {
      ...newMatch.value,
      localTries: 0,
      visitorTries: 0,
      status: 'SCHEDULED',
    })

    success.value = 'Match created successfully'
    resetCreateForm()

    await loadData()
  } catch (err) {
    console.error(err)
    error.value = 'Could not create match'
  }
}

function resetCreateForm() {
  selectedCategory.value = ''

  newMatch.value = {
    localTeamId: '',
    visitorTeamId: '',
    fieldId: '',
    matchDate: '',
    startTime: '',
    endTime: '',
    localTries: 0,
    visitorTries: 0,
    status: 'SCHEDULED',
    roundNumber: 1,
  }
}

async function updateMatch() {
  try {
    error.value = ''
    success.value = ''

    if (!selectedMatchId.value) {
      error.value = 'Please select a match'
      return
    }

    const selectedMatch = matches.value.find((match) => match.id === selectedMatchId.value)

    if (!selectedMatch) {
      error.value = 'Selected match not found'
      return
    }

    await api.put(`/api/matches/${selectedMatchId.value}`, {
      localTeamId: selectedMatch.localTeam?.id,
      visitorTeamId: selectedMatch.visitorTeam?.id,
      fieldId: selectedMatch.field?.id,
      matchDate: selectedMatch.matchDate,
      startTime: selectedMatch.startTime,
      endTime: selectedMatch.endTime,
      roundNumber: selectedMatch.roundNumber,
      localTries: matchUpdate.value.localTries,
      visitorTries: matchUpdate.value.visitorTries,
      status: matchUpdate.value.status,
    })

    success.value = 'Match updated successfully'
    resetUpdateForm()

    await loadData()
  } catch (err) {
    console.error(err)
    error.value = 'Could not update match'
  }
}

async function deleteMatch() {
  try {
    error.value = ''
    success.value = ''

    if (!selectedMatchId.value) {
      error.value = 'Please select a match'
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this match?')

    if (!confirmed) {
      return
    }

    await api.delete(`/api/matches/${selectedMatchId.value}`)

    success.value = 'Match deleted successfully'

    resetUpdateForm()

    await loadData()
  } catch (err) {
    console.error(err)

    error.value = 'Could not delete match'
  }
}

async function createField() {
  try {
    error.value = ''
    success.value = ''

    await api.post('/api/fields', newField.value)

    success.value = 'Field created successfully'

    newField.value = {
      name: '',
      location: '',
    }

    await loadData()
  } catch (err) {
    console.error(err)

    error.value = 'Could not create field'
  }
}

onMounted(loadData)
</script>

<template>
  <section>
    <h2>Admin Panel</h2>

    <p v-if="success" class="success-message">
      {{ success }}
    </p>

    <p v-if="error" class="error-message">
      {{ error }}
    </p>

    <div class="admin-stats">
      <div class="stat-card">
        <span>{{ matches.length }}</span>
        <p>Matches</p>
      </div>

      <div class="stat-card">
        <span>{{ teams.length }}</span>
        <p>Teams</p>
      </div>

      <div class="stat-card">
        <span>{{ fields.length }}</span>
        <p>Fields</p>
      </div>
    </div>

    <div class="admin-tabs">
      <button
        :class="{ active: selectedAdminTab === 'create' }"
        @click="selectedAdminTab = 'create'"
      >
        📅 Create Match
      </button>

      <button
        :class="{ active: selectedAdminTab === 'update' }"
        @click="selectedAdminTab = 'update'"
      >
        🏆 Update Match
      </button>

      <button :class="{ active: selectedAdminTab === 'field' }" @click="selectedAdminTab = 'field'">
        📍 Create Field
      </button>
    </div>

    <form v-if="selectedAdminTab === 'create'" class="admin-form">
      <h3>Create Match</h3>

      <div class="form-group">
        <label for="category">Category</label>

        <select id="category" v-model="selectedCategory" @change="resetSelectedTeams">
          <option value="">Select category</option>

          <option v-for="category in CATEGORIES" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="localTeam">Local Team</label>

        <select id="localTeam" v-model="newMatch.localTeamId">
          <option value="">Select local team</option>

          <option v-for="team in filteredTeams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="visitorTeam">Visitor Team</label>

        <select id="visitorTeam" v-model="newMatch.visitorTeamId">
          <option value="">Select visitor team</option>

          <option v-for="team in visitorTeams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="field">Field</label>

        <select id="field" v-model="newMatch.fieldId">
          <option value="">Select field</option>

          <option v-for="field in fields" :key="field.id" :value="field.id">
            {{ field.name }} - {{ field.location }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="matchDate">Match Date</label>

          <input id="matchDate" v-model="newMatch.matchDate" type="date" />
        </div>

        <div class="form-group">
          <label for="roundNumber">Round</label>

          <input id="roundNumber" v-model="newMatch.roundNumber" type="number" min="1" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startTime">Start Time</label>

          <input id="startTime" v-model="newMatch.startTime" type="time" />
        </div>

        <div class="form-group">
          <label for="endTime">End Time</label>

          <input id="endTime" v-model="newMatch.endTime" type="time" />
        </div>
      </div>

      <button type="button" class="create-button" @click="createMatch">Create Match</button>
    </form>

    <form v-if="selectedAdminTab === 'update'" class="admin-form">
      <h3>Update Match Result</h3>

      <div class="form-group">
        <label for="match">Match</label>

        <div class="form-group">
          <select v-model="updateCategory">
            <option value="">Select category</option>

            <option v-for="category in CATEGORIES" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <label>Category</label>
        <select id="match" v-model="selectedMatchId">
          <option value="">Select match</option>

          <option v-for="match in filteredMatches" :key="match.id" :value="match.id">
            {{ match.localTeam?.name || 'Unknown local team' }}
            vs
            {{ match.visitorTeam?.name || 'Unknown visitor team' }}
            · {{ match.matchDate }} · {{ match.startTime.substring(0, 5) }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="localTries">Local Tries</label>

          <input id="localTries" v-model="matchUpdate.localTries" type="number" min="0" />
        </div>

        <div class="form-group">
          <label for="visitorTries">Visitor Tries</label>

          <input id="visitorTries" v-model="matchUpdate.visitorTries" type="number" min="0" />
        </div>
      </div>

      <div class="form-group">
        <label for="status">Status</label>

        <select id="status" v-model="matchUpdate.status">
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="FINISHED">FINISHED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <button type="button" class="create-button" @click="updateMatch">Update Match</button>
      <button type="button" class="delete-button" @click="deleteMatch">Delete Match</button>
    </form>

    <form v-if="selectedAdminTab === 'field'" class="admin-form">
      <h3>Create Field</h3>

      <div class="form-group">
        <label for="fieldName"> Field Name </label>

        <input id="fieldName" v-model="newField.name" type="text" placeholder="Field 3" />
      </div>

      <div class="form-group">
        <label for="fieldLocation"> Location </label>

        <input id="fieldLocation" v-model="newField.location" type="text" placeholder="Sant Boi" />
      </div>

      <button type="button" class="create-button" @click="createField">Create Field</button>
    </form>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);

  padding: 16px;
}

h2,
h3 {
  color: var(--primary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  color: var(--primary);
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 10px;

  border: 1px solid var(--border);
  border-radius: 8px;

  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.create-button {
  align-self: center;
  width: 50%;
  max-width: 260px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.create-button:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.success-message {
  color: green;
  font-weight: 700;
}

.error-message {
  color: red;
  font-weight: 700;
}

.admin-tabs {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}

.admin-tabs button {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
  padding: 10px 0;
  position: relative;
  cursor: pointer;
}

.admin-tabs button.active {
  color: var(--primary);
}

.admin-tabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -9px;
  height: 4px;
  background: var(--primary);
  border-radius: 999px;
}

.delete-button {
  align-self: center;
  width: 50%;
  max-width: 260px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.delete-button:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat-card span {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: #eafadd;
}

.stat-card p {
  margin: 6px 0 0 0;

  color: #fff;

  font-size: 0.9rem;
}


</style>
