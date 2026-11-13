<script setup>
import { useBilletterie } from '../../composables/useBilletterie.js'
import { formaterDateLongue, formaterHeure } from '../../helpers.js'

const { idEvenement, nombrePersonnes, erreur, enCours, numeroBillet, evenementsOptions, estFavori, valider } =
  useBilletterie()
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Billetterie</h1>
      <p>Choisis un événement et réserve ton billet.</p>
    </section>

    <div v-if="numeroBillet" class="confirmation">
      <p>Ton billet est confirmé !</p>
      <p class="numero">Numéro de billet : {{ numeroBillet }}</p>
    </div>

    <form v-else class="formulaire" @submit.prevent="valider">
      <div class="champ">
        <label for="evenement">Événement</label>
        <select id="evenement" v-model="idEvenement" required>
          <option value="" disabled>Choisis un événement</option>
          <option v-for="evenement in evenementsOptions" :key="evenement.id" :value="evenement.id">
            {{ estFavori(evenement.id) ? '★ ' : '' }}{{ evenement.titre }} — {{ formaterDateLongue(evenement.date) }} à {{ formaterHeure(evenement.heureDebut) }}
          </option>
        </select>
      </div>

      <div class="champ">
        <label for="personnes">Nombre de personnes</label>
        <input id="personnes" type="number" v-model.number="nombrePersonnes" min="1" max="10" step="1" required />
      </div>

      <button type="submit" class="bouton bouton-primaire" :disabled="enCours">Réserver mon billet</button>
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </form>
  </main>
</template>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-600);
  max-width: 480px;
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
.champ select,
.champ input {
  border: var(--border-width-050) solid var(--color-searchbar-border);
  border-radius: var(--hors-ds-radius-button);
  padding: var(--spacing-300) var(--spacing-400);
  font-family: var(--hors-ds-font-family-button);
  font-size: var(--font-size-large);
  color: var(--color-text-body);
  background: var(--color-searchbar-bg);
}

.bouton {
  align-self: flex-start;
}

.erreur {
  color: var(--color-state-error);
  margin: 0;
}

.confirmation {
  padding: var(--spacing-800);
  background: var(--color-bg-surface);
  border-radius: var(--radius-300);
  max-width: 480px;
}
.confirmation p {
  margin: 0 0 var(--spacing-200);
  font-size: var(--font-size-large);
}
.numero {
  font-weight: var(--font-weight-bold);
}
</style>
