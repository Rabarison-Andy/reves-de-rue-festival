<script setup>
import { useInscription } from '../../composables/useInscription.js'

const { nom, email, motDePasse, erreur, enCours, confirmationRequise, valider } = useInscription()
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Inscription</h1>
      <p>Crée un compte pour mettre des événements en favoris et réserver des billets.</p>
    </section>

    <form v-if="!confirmationRequise" class="formulaire" @submit.prevent="valider">
      <div class="champ">
        <label for="nom">Nom</label>
        <input id="nom" v-model="nom" type="text" autocomplete="name" required />
      </div>
      <div class="champ">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
      </div>
      <div class="champ">
        <label for="mot-de-passe">Mot de passe</label>
        <input id="mot-de-passe" v-model="motDePasse" type="password" autocomplete="new-password" required minlength="6" />
      </div>

      <div class="actions-formulaire">
        <button type="submit" class="bouton bouton-primaire" :disabled="enCours">S'inscrire</button>
      </div>
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </form>

    <p v-else class="confirmation">
      Un email de confirmation a été envoyé à {{ email }}. Clique sur le lien reçu pour activer ton compte.
    </p>

    <p class="lien-secondaire"><RouterLink to="/connexion">Déjà un compte ? Se connecter</RouterLink></p>
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
.confirmation {
  max-width: 480px;
  padding: var(--spacing-800);
  background: var(--color-bg-surface);
  border-radius: var(--radius-300);
  font-size: var(--font-size-large);
}
.lien-secondaire {
  font-size: var(--font-size-medium);
}
</style>
