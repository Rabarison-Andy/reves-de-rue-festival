<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import PopupConnexionRequise from './components/PopupConnexionRequise.vue'
import { useEvenementsStore } from './stores/evenements.js'
import { useAuthStore } from './stores/auth.js'

const store = useEvenementsStore()
const authStore = useAuthStore()

onMounted(() => {
  store.charger()
  authStore.initialiser()
})
</script>

<template>
  <AppHeader />
  <p v-if="store.chargement" class="etat-chargement">Chargement du festival…</p>
  <p v-else-if="store.erreur" class="etat-erreur">{{ store.erreur }}</p>
  <RouterView v-else />
  <AppFooter />
  <PopupConnexionRequise />
</template>

<style scoped>
.etat-chargement,
.etat-erreur {
  text-align: center;
  padding: var(--spacing-1000) var(--spacing-600);
  font-size: var(--font-size-large);
  color: var(--color-text-body);
}
.etat-erreur {
  color: var(--color-state-error);
}
</style>
