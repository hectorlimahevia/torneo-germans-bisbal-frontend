<script setup>
import { ref } from 'vue'
import { isAuthenticated, logout } from '@/auth/auth'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleLogout() {
  logout()
  closeMenu()
}
</script>

<template>

<header class="app-header">
<button
  class="menu-button"
  :class="{ open: isMenuOpen }"
  type="button"
  @click="toggleMenu"
>
  {{ isMenuOpen ? '✕' : '☰' }}
</button>
</header>

  <nav
    v-if="isMenuOpen"
    class="mobile-menu"
  >
    <RouterLink to="/" @click="closeMenu">Home</RouterLink>
    <RouterLink to="/standings" @click="closeMenu">Standings</RouterLink>
    <RouterLink to="/matches" @click="closeMenu">Matches</RouterLink>
    <RouterLink to="/teams" @click="closeMenu">Teams</RouterLink>
    <RouterLink to="/rules" @click="closeMenu">Rules</RouterLink>

    <RouterLink
      v-if="isAuthenticated"
      to="/ai"
      @click="closeMenu"
    >
      AI Assistant
    </RouterLink>

    <RouterLink
      v-if="!isAuthenticated"
      to="/login"
      @click="closeMenu"
    >
      Login
    </RouterLink>

    <button
      v-if="isAuthenticated"
      type="button"
      class="logout-link"
      @click="handleLogout"
    >
      Logout
    </button>
  </nav>

<main class="app-main">
  <RouterView v-slot="{ Component, route }">
    <component
      :is="Component"
      :class="{ 'page-container': route.name !== 'login' }"
    />
  </RouterView>
</main>

</template>

<style scoped>
.page-container {
  padding-inline: 16px;
  padding-bottom: 10px;
}

.app-header {
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 100;
}

.menu-button {
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 34px;
  font-weight: 800;
  cursor: pointer;
}

.menu-button.open {
  color: white;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;

  width: 270px;
  height: 100vh;

  background: var(--primary);

  display: flex;
  flex-direction: column;

  padding-top: 90px;
  box-shadow: var(--shadow);
}

.mobile-menu a,
.logout-link {
  padding: 16px 28px;

  color: white;
  background: transparent;

  text-decoration: none;
  font-weight: 500;
  font-size: 16px;

  border: none;
  text-align: left;
  cursor: pointer;
}

.mobile-menu a:hover,
.logout-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

.app-main {
  min-height: 100vh;
  padding-top: 72px;
}
</style>
