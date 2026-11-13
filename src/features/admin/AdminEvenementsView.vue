<script setup>
import { onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { useAdminEvenements } from '../../composables/useAdminEvenements.js'
import { useExigeAdmin } from '../../composables/useExigeAdmin.js'
import { formaterDateLongue } from '../../helpers.js'

useExigeAdmin()

const {
  evenements,
  scenes,
  categories,
  artistes,
  page,
  totalPages,
  enEdition,
  formulaireOuvert,
  erreur,
  enCours,
  initialiser,
  ouvrirCreation,
  ouvrirEdition,
  fermerFormulaire,
  valider,
  supprimer,
  pageSuivante,
  pagePrecedente,
} = useAdminEvenements()

onMounted(initialiser)

function nomScene(id) {
  const scene = scenes.value.find((s) => s.id_scene === id)
  return scene ? scene.nom : '—'
}

function libelleCategorie(id) {
  const categorie = categories.value.find((c) => c.id_categorie === id)
  return categorie ? categorie.libelle : '—'
}
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Administration — Événements</h1>
      <p>Crée, modifie ou supprime les événements du programme.</p>
    </section>

    <AdminNav />

    <button type="button" class="bouton bouton-primaire" @click="ouvrirCreation">Nouvel événement</button>

    <form v-if="formulaireOuvert" class="formulaire" @submit.prevent="valider">
      <h2>{{ enEdition.id ? 'Modifier' : 'Créer' }} un événement</h2>

      <div class="champ">
        <label for="titre">Titre</label>
        <input id="titre" v-model="enEdition.titre" type="text" required />
      </div>

      <div class="champ">
        <label for="description">Description</label>
        <textarea id="description" v-model="enEdition.description" rows="3"></textarea>
      </div>

      <div class="ligne">
        <div class="champ">
          <label for="date-debut">Date de début</label>
          <input id="date-debut" v-model="enEdition.dateDebut" type="date" required />
        </div>
        <div class="champ">
          <label for="date-fin">Date de fin</label>
          <input id="date-fin" v-model="enEdition.dateFin" type="date" />
        </div>
      </div>

      <div class="ligne">
        <div class="champ">
          <label for="heure-debut">Heure de début</label>
          <input id="heure-debut" v-model="enEdition.heureDebut" type="time" required />
        </div>
        <div class="champ">
          <label for="heure-fin">Heure de fin</label>
          <input id="heure-fin" v-model="enEdition.heureFin" type="time" />
        </div>
      </div>

      <div class="ligne">
        <div class="champ">
          <label for="scene">Scène</label>
          <select id="scene" v-model="enEdition.idScene">
            <option value="">Aucune</option>
            <option v-for="scene in scenes" :key="scene.id_scene" :value="scene.id_scene">{{ scene.nom }}</option>
          </select>
        </div>
        <div class="champ">
          <label for="categorie">Catégorie</label>
          <select id="categorie" v-model="enEdition.idCategorie">
            <option value="">Aucune</option>
            <option v-for="categorie in categories" :key="categorie.id_categorie" :value="categorie.id_categorie">
              {{ categorie.libelle }}
            </option>
          </select>
        </div>
      </div>

      <div class="champ">
        <label for="zone">Zone</label>
        <input id="zone" v-model="enEdition.zone" type="text" />
      </div>

      <div class="champ">
        <label for="image">Image (URL)</label>
        <input id="image" v-model="enEdition.image" type="text" />
      </div>

      <div class="champ">
        <label for="artistes">Artistes</label>
        <select id="artistes" v-model="enEdition.artistes" multiple size="5">
          <option v-for="artiste in artistes" :key="artiste.id" :value="artiste.id">{{ artiste.nom }}</option>
        </select>
      </div>

      <label class="case">
        <input v-model="enEdition.phare" type="checkbox" />
        Événement phare (mis en avant sur l'accueil)
      </label>

      <div class="actions-formulaire">
        <button type="submit" class="bouton bouton-primaire" :disabled="enCours">Enregistrer</button>
        <button type="button" class="bouton bouton-secondaire" @click="fermerFormulaire">Annuler</button>
      </div>
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </form>

    <table class="tableau">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Date</th>
          <th>Scène</th>
          <th>Catégorie</th>
          <th>Phare</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="evenement in evenements" :key="evenement.id">
          <td>{{ evenement.titre }}</td>
          <td>{{ formaterDateLongue(evenement.dateDebut) }}</td>
          <td>{{ nomScene(evenement.idScene) }}</td>
          <td>{{ libelleCategorie(evenement.idCategorie) }}</td>
          <td>{{ evenement.phare ? 'Oui' : 'Non' }}</td>
          <td class="actions-ligne">
            <button type="button" class="bouton-lien" @click="ouvrirEdition(evenement)">Modifier</button>
            <button type="button" class="bouton-lien" @click="supprimer(evenement.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button type="button" class="bouton bouton-secondaire" :disabled="page === 0" @click="pagePrecedente">
        Précédent
      </button>
      <span>Page {{ page + 1 }} / {{ totalPages }}</span>
      <button type="button" class="bouton bouton-secondaire" :disabled="page + 1 >= totalPages" @click="pageSuivante">
        Suivant
      </button>
    </div>
  </main>
</template>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-400);
  max-width: 640px;
  margin: var(--spacing-600) 0;
  padding: var(--spacing-600);
  background: var(--color-bg-surface);
  border-radius: var(--radius-300);
}
.formulaire h2 {
  margin: 0;
  font-size: var(--font-size-heading-3);
}
.ligne {
  display: flex;
  gap: var(--spacing-400);
}
.ligne .champ {
  flex: 1;
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
.champ select,
.champ textarea {
  border: var(--border-width-050) solid var(--color-searchbar-border);
  border-radius: var(--hors-ds-radius-button);
  padding: var(--spacing-300) var(--spacing-400);
  font-family: var(--hors-ds-font-family-button);
  font-size: var(--font-size-large);
  color: var(--color-text-body);
  background: var(--color-searchbar-bg);
}
.case {
  display: flex;
  align-items: center;
  gap: var(--spacing-200);
  font-weight: var(--font-weight-bold);
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
.pagination {
  display: flex;
  align-items: center;
  gap: var(--spacing-400);
  margin-top: var(--spacing-400);
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
