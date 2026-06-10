<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { isAuthenticated } from '@/auth/auth'

import api from '@/api/api'

const matches = ref([])
const error = ref('')

async function loadHomeData() {
  try {
    const matchesResponse = await api.get('/api/matches')

    matches.value = matchesResponse.data.slice(0, 3)
  } catch (err) {
    console.error(err)
    error.value = 'Could not load home data'
  }
}
onMounted(loadHomeData)
</script>

<template>
  <section class="home">
    <section class="home-hero">
      <img src="@/assets/logo_ues.png" alt="Torneo Germans Bisbal" class="hero-logo" />

      <div class="hero-title">
        <span class="hero-kicker"> TORNEO </span>

        <h1>
          GERMANS<br />
          BISBAL
        </h1>

        <p class="hero-slogan">PASSIÓ PEL RUGBY</p>
      </div>
    </section>

    <div class="quick-nav">
      <RouterLink to="/standings"> Standings </RouterLink>

      <RouterLink to="/matches"> Matches </RouterLink>

      <RouterLink to="/teams"> Teams </RouterLink>

      <RouterLink to="/rules"> Rules </RouterLink>

      <RouterLink v-if="isAuthenticated" to="/ai"> AI </RouterLink>
    </div>

    <section class="home-section">
      <div class="section-header">
        <h2>Latest Matches</h2>
        <RouterLink to="/matches">View all</RouterLink>
      </div>

      <div class="mini-list">
        <div v-for="match in matches" :key="match.id" class="mini-card">
          <strong> {{ match.localTeam.name }} vs {{ match.visitorTeam.name }} </strong>

          <span> {{ match.field.name }} · {{ match.startTime.substring(0, 5) }} </span>
        </div>
      </div>
    </section>

    <section class="poster-section">
      <img
        src="@/assets/cartel_torneo.jpg"
        alt="Torneo Germans Bisbal poster"
        class="poster-image"
      />
    </section>

    <section class="about-section">
      <h2>About the Tournament</h2>

      <p>
        The Germans Bisbal Tournament is a celebration of grassroots rugby, sportsmanship and
        teamwork. Organised by the U.E. Santboiana rugby school, it brings together young players
        from different clubs to enjoy a day of competition, friendship and rugby values.
      </p>

      <p>
        U.E. Santboiana is one of the most historic rugby clubs in Spain and has played a key role
        in the development of rugby for generations. The tournament reflects this commitment to
        education, respect and passion for the sport.
      </p>
    </section>

    <section class="sponsors-section">
      <h2>Sponsors</h2>

      <div class="sponsors-carousel">
        <div class="sponsor-card"><img src="@/assets/autovivo_logo.jpg" alt="Sponsor" /></div>

        <div class="sponsor-card"><img src="@/assets/bitmat_logo.png" alt="Sponsor" /></div>

        <div class="sponsor-card"><img src="@/assets/neopeques_logo.png" alt="Sponsor" /></div>

        <div class="sponsor-card"><img src="@/assets/lecoq_logo.jpg" alt="Sponsor" /></div>
      </div>
    </section>

    <p v-if="error">
      {{ error }}
    </p>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100vh;
}

.home-hero {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.hero-logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 12px;
}

.hero-kicker {
  display: block;

  color: var(--primary);

  font-size: 13px;
  font-weight: 800;

  letter-spacing: 8px;

  margin-bottom: 6px;
}

.hero-title h1 {
  margin: 0;

  color: var(--primary);

  font-size: 46px;
  line-height: 0.95;

  font-weight: 900;
}

.hero-slogan {
  margin-top: 12px;

  color: #7d6a52;

  font-size: 14px;
  font-weight: 800;

  letter-spacing: 2px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-actions a {
  background: var(--card);
  color: var(--primary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
  text-decoration: none;
  font-weight: 800;
  box-shadow: var(--shadow);
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  color: var(--primary);
  font-size: 20px;
}

.section-header a {
  color: var(--primary);
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
}

.mini-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mini-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 14px;

  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mini-card strong {
  color: var(--primary);
}

.mini-card span {
  color: var(--text-secondary);
  font-size: 14px;
}

.quick-nav {
  display: flex;
  gap: 20px;

  overflow-x: auto;

  padding-bottom: 8px;

  border-bottom: 1px solid var(--border);
}

.quick-nav a {
  text-decoration: none;

  color: var(--text-secondary);

  font-weight: 800;

  white-space: nowrap;
}

/* poster-section */

.poster-section {
  display: flex;
  justify-content: center;
  margin-top: 4%;
}

.poster-image {
  width: 100%;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

/* about-section  */

.about-section {
  padding: 8px;
}

.about-section h2 {
  margin-top: 0;

  color: var(--primary);
}

.about-section p {
  line-height: 1.6;

  color: var(--text-secondary);
}

/* sponsors-section  */
.sponsors-section {
  margin-bottom: 24px;
}

.sponsors-section h2 {
  color: var(--primary);
}

.sponsors-carousel {
  display: flex;
  gap: 12px;

  overflow-x: auto;

  padding-bottom: 8px;
}

.sponsor-card {
  min-width: 110px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  font-weight: 700;
  color: var(--primary);
}

.sponsor-card img {
  max-width: 80%;
  max-height: 60px;
  object-fit: contain;
}
</style>
