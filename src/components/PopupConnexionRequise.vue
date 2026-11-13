<script setup>
import { useFavorisStore } from '../stores/favoris.js'

const store = useFavorisStore()
</script>

<template>
  <div v-if="store.demandeConnexion || store.accesInterdit" class="fond" @click.self="store.fermerPopup">
    <div class="popup">
      <template v-if="store.demandeConnexion">
        <p>Tu dois être connecté pour ajouter un événement à tes favoris.</p>
        <div class="actions">
          <RouterLink to="/connexion" class="bouton bouton-primaire" @click="store.fermerPopup">Se connecter</RouterLink>
          <button type="button" class="bouton bouton-secondaire" @click="store.fermerPopup">Fermer</button>
        </div>
      </template>
      <template v-else>
        <p>Les comptes artiste ne peuvent pas ajouter de favoris.</p>
        <div class="actions">
          <button type="button" class="bouton bouton-secondaire" @click="store.fermerPopup">Fermer</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fond {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 50%);
  padding: var(--spacing-600);
  z-index: 10;
}
.popup {
  max-width: 420px;
  padding: var(--spacing-600);
  background: var(--color-bg-surface);
  border-radius: var(--radius-300);
}
.popup p {
  margin: 0 0 var(--spacing-400);
  font-size: var(--font-size-large);
  color: var(--color-text-body);
}
.actions {
  display: flex;
  gap: var(--spacing-400);
}
</style>
