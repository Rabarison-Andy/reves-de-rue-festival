<script setup>
import { useConnexion } from '../../composables/useConnexion.js'

const { email, motDePasse, erreur, enCours, valider } = useConnexion()
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Connexion</h1>
      <p>Accède à ton compte pour gérer tes favoris et tes billets.</p>
    </section>

    <form class="formulaire" @submit.prevent="valider">
      <div class="champ">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
      </div>
      <div class="champ">
        <label for="mot-de-passe">Mot de passe</label>
        <input id="mot-de-passe" v-model="motDePasse" type="password" autocomplete="current-password" required />
      </div>

      <div class="actions-formulaire">
        <button type="submit" class="bouton bouton-primaire" :disabled="enCours">Se connecter</button>
      </div>
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </form>

    <p class="lien-secondaire"><RouterLink to="/inscription">Pas de compte ? S'inscrire</RouterLink></p>
  </main>
</template>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-400);
  max-width: 480px;
  margin: 0 0 var(--spacing-600);
  padding: var(--spacing-600);
  background: var(--color-bg-surface);
  border-radius: var(--radius-300);
}
.champ {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-200);
}
.champ label {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-h2);
}
.champ input {
  border: var(--border-width-050) solid var(--color-searchbar-border);
  border-radius: var(--hors-ds-radius-button);
  padding: var(--spacing-300) var(--spacing-400);
  font-family: var(--hors-ds-font-family-button);
  font-size: var(--font-size-large);
  color: var(--color-text-body);
  background: var(--color-searchbar-bg);
}
.actions-formulaire {
  display: flex;
  gap: var(--spacing-400);
}
.erreur {
  color: var(--color-state-error);
  margin: 0;
}
.lien-secondaire {
  font-size: var(--font-size-medium);
}
</style>
