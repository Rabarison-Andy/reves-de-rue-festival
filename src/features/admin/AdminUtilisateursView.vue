<script setup>
import { onMounted } from 'vue'
import AdminNav from '../../components/AdminNav.vue'
import { useAdminUtilisateurs } from '../../composables/useAdminUtilisateurs.js'
import { useExigeAdmin } from '../../composables/useExigeAdmin.js'

useExigeAdmin()

const { utilisateurs, erreur, initialiser, changerRole } = useAdminUtilisateurs()

onMounted(initialiser)
</script>

<template>
  <main class="page">
    <section class="entete">
      <h1>Administration — Utilisateurs</h1>
      <p>Consulte les comptes et change leur rôle.</p>
    </section>

    <AdminNav />

    <p v-if="erreur" class="erreur">{{ erreur }}</p>

    <table class="tableau">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="utilisateur in utilisateurs" :key="utilisateur.id">
          <td>{{ utilisateur.nom }}</td>
          <td>{{ utilisateur.email }}</td>
          <td>
            <select :value="utilisateur.role" @change="changerRole(utilisateur.id, $event.target.value)">
              <option value="utilisateur">Utilisateur</option>
              <option value="artiste">Artiste</option>
              <option value="admin">Admin</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
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
.tableau select {
  border: var(--border-width-050) solid var(--color-searchbar-border);
  border-radius: var(--hors-ds-radius-button);
  padding: var(--spacing-150) var(--spacing-300);
  font-family: var(--hors-ds-font-family-button);
  background: var(--color-searchbar-bg);
  color: var(--color-text-body);
}
</style>
