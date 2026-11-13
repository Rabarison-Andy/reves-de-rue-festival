<script setup>
import { onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { useAdminArtistes } from '../../composables/useAdminArtistes.js'
import { useExigeAdmin } from '../../composables/useExigeAdmin.js'

useExigeAdmin()

const { artistes, enEdition, formulaireOuvert, erreur, enCours, initialiser, ouvrirCreation, ouvrirEdition, fermerFormulaire, valider, supprimer } =
  useAdminArtistes()

onMounted(initialiser)
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Administration — Artistes</h1>
      <p>Crée, modifie ou supprime les artistes du festival.</p>
    </section>

    <AdminNav />

    <button type="button" class="bouton bouton-primaire" @click="ouvrirCreation">Nouvel artiste</button>

    <form v-if="formulaireOuvert" class="formulaire" @submit.prevent="valider">
      <h2>{{ enEdition.id ? 'Modifier' : 'Créer' }} un artiste</h2>

      <div class="champ">
        <label for="nom">Nom</label>
        <input id="nom" v-model="enEdition.nom" type="text" required />
      </div>

      <div class="champ">
        <label for="discipline">Discipline</label>
        <input id="discipline" v-model="enEdition.discipline" type="text" />
      </div>

      <div class="champ">
        <label for="bio">Biographie</label>
        <textarea id="bio" v-model="enEdition.bio" rows="3"></textarea>
      </div>

      <div class="champ">
        <label for="site-web">Site web</label>
        <input id="site-web" v-model="enEdition.siteWeb" type="text" />
      </div>

      <div class="actions-formulaire">
        <button type="submit" class="bouton bouton-primaire" :disabled="enCours">Enregistrer</button>
        <button type="button" class="bouton bouton-secondaire" @click="fermerFormulaire">Annuler</button>
      </div>
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </form>

    <table class="tableau">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Discipline</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="artiste in artistes" :key="artiste.id">
          <td>{{ artiste.nom }}</td>
          <td>{{ artiste.discipline }}</td>
          <td class="actions-ligne">
            <button type="button" class="bouton-lien" @click="ouvrirEdition(artiste)">Modifier</button>
            <button type="button" class="bouton-lien" @click="supprimer(artiste.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-400);
  max-width: 480px;
  margin: var(--spacing-600) 0;
  padding: var(--spacing-600);
  background: var(--color-bg-surface);
  border-radius: var(--radius-300);
}
.formulaire h2 {
  margin: 0;
  font-size: var(--font-size-heading-3);
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
.champ input,
.champ textarea {
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

.tableau {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-600);
}
.tableau th {
  text-align: left;
  font-family: var(--font-family-headings);
  color: var(--color-text-h2);
  padding: var(--spacing-300);
  border-bottom: var(--border-width-100) solid var(--color-text-body);
}
.tableau td {
  padding: var(--spacing-300);
  border-bottom: var(--border-width-050) solid var(--color-searchbar-border);
}
.actions-ligne {
  display: flex;
  gap: var(--spacing-300);
}
.bouton-lien {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--color-btn-link-text-default);
  font-size: var(--font-size-small);
  text-decoration: underline;
}
</style>
