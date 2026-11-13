<script setup>
import { onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { useAdminBillets } from '../../composables/useAdminBillets.js'
import { useExigeAdmin } from '../../composables/useExigeAdmin.js'
import { formaterDateLongue } from '../../helpers.js'

useExigeAdmin()

const { billets, page, totalPages, erreur, initialiser, pageSuivante, pagePrecedente } = useAdminBillets()

onMounted(initialiser)
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Administration — Billets</h1>
      <p>Toutes les ventes de billets du festival.</p>
    </section>

    <AdminNav />

    <p v-if="erreur" class="erreur">{{ erreur }}</p>

    <table class="tableau">
      <thead>
        <tr>
          <th>Numéro</th>
          <th>Événement</th>
          <th>Acheteur</th>
          <th>Personnes</th>
          <th>Prix</th>
          <th>Date d'achat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="billet in billets" :key="billet.id">
          <td class="numero">{{ billet.numero }}</td>
          <td>{{ billet.evenement }}</td>
          <td>{{ billet.acheteur }}</td>
          <td>{{ billet.nombrePersonnes }}</td>
          <td>{{ billet.prix }} €</td>
          <td>{{ formaterDateLongue(billet.dateAchat.slice(0, 10)) }}</td>
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
.erreur {
  color: var(--color-state-error);
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
.numero {
  font-family: monospace;
  font-size: var(--font-size-small);
}
.pagination {
  display: flex;
  align-items: center;
  gap: var(--spacing-400);
  margin-top: var(--spacing-400);
}
</style>
