<script setup>
import { ref, onMounted } from 'vue'

import api from '@/api/api'

import AdminStats from '@/components/admin/AdminStats.vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import ScheduleMatchForm from '@/components/admin/ScheduleMatchForm.vue'
import UpdateMatchForm from '@/components/admin/UpdateMatchForm.vue'
import CreateFieldForm from '@/components/admin/CreateFieldForm.vue'

import { useToast } from '@/composables/useToast'

const teams = ref([])
const fields = ref([])
const matches = ref([])

const selectedAdminTab = ref('create')
const error = ref('')

const { showToast } = useToast()

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

function getErrorMessage(err, fallbackMessage) {
  return err.response?.data?.message || fallbackMessage
}

async function createMatch(matchData) {
  try {
    error.value = ''

    await api.post('/api/matches', {
      ...matchData,
      localTries: 0,
      visitorTries: 0,
      status: 'SCHEDULED',
    })

    showToast('Match created successfully', 'success')

    await loadData()
  } catch (err) {
    console.error(err)

    showToast(getErrorMessage(err, 'Could not create match'), 'error')
  }
}

async function updateMatch(payload) {
  const selectedMatchId = payload.selectedMatchId
  const matchUpdate = payload.matchUpdate

  try {
    error.value = ''

    if (!selectedMatchId) {
      showToast('Please select a match', 'error')
      return
    }

    const selectedMatch = matches.value.find((match) => match.id === selectedMatchId)

    if (!selectedMatch) {
      showToast('Selected match not found', 'error')
      return
    }

    await api.put(`/api/matches/${selectedMatchId}`, {
      localTeamId: selectedMatch.localTeam?.id,
      visitorTeamId: selectedMatch.visitorTeam?.id,
      fieldId: selectedMatch.field?.id,
      matchDate: selectedMatch.matchDate,
      startTime: selectedMatch.startTime,
      endTime: selectedMatch.endTime,
      roundNumber: selectedMatch.roundNumber,
      localTries: matchUpdate.localTries,
      visitorTries: matchUpdate.visitorTries,
      status: matchUpdate.status,
    })

    showToast('Match updated successfully', 'success')

    await loadData()
  } catch (err) {
    console.error(err)

    showToast(getErrorMessage(err, 'Could not update match'), 'error')
  }
}

async function deleteMatch(selectedMatchId) {
  try {
    error.value = ''

    if (!selectedMatchId) {
      showToast('Please select a match', 'error')
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this match?')

    if (!confirmed) {
      return
    }

    await api.delete(`/api/matches/${selectedMatchId}`)

    showToast('Match deleted successfully', 'success')

    await loadData()
  } catch (err) {
    console.error(err)

    showToast(getErrorMessage(err, 'Could not delete match'), 'error')
  }
}

async function createField(fieldData) {
  try {
    error.value = ''

    await api.post('/api/fields', fieldData)

    showToast('Field created successfully', 'success')

    await loadData()
  } catch (err) {
    console.error(err)

    showToast(getErrorMessage(err, 'Could not create field'), 'error')
  }
}

async function deleteField(fieldId) {
  try {
    error.value = ''

    if (!fieldId) {
      showToast('Please select a field', 'error')
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this field?')

    if (!confirmed) {
      return
    }

    await api.delete(`/api/fields/${fieldId}`)

    showToast('Field deleted successfully', 'success')

    await loadData()
  } catch (err) {
    console.error(err)

    showToast(getErrorMessage(err, 'Could not delete field'), 'error')
  }
}

onMounted(loadData)
</script>

<template>
  <section>
    <h2>Admin Panel</h2>

    <AdminStats
      :matches-count="matches.length"
      :teams-count="teams.length"
      :fields-count="fields.length"
    />

    <AdminTabs :selected-tab="selectedAdminTab" @tab-selected="selectedAdminTab = $event" />

    <ScheduleMatchForm
      v-if="selectedAdminTab === 'create'"
      :teams="teams"
      :fields="fields"
      @match-created="createMatch"
    />

    <UpdateMatchForm
      v-if="selectedAdminTab === 'update'"
      :matches="matches"
      @match-updated="updateMatch"
      @match-deleted="deleteMatch"
    />

    <CreateFieldForm
      v-if="selectedAdminTab === 'field'"
      :fields="fields"
      @field-created="createField"
      @field-deleted="deleteField"
    />

    <p v-if="error" class="error-message">
      {{ error }}
    </p>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  color: var(--primary);
}

.error-message {
  color: red;
  font-weight: 700;
}
</style>
