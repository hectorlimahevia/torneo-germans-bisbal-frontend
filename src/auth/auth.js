import { ref } from 'vue'

export const isAuthenticated = ref(
  !!localStorage.getItem('access_token'),
)

export function login(token) {
  localStorage.setItem('access_token', token)
  isAuthenticated.value = true
}

export function logout() {
  localStorage.removeItem('access_token')
  isAuthenticated.value = false
}
