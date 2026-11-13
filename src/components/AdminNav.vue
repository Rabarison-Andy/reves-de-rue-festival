<template>
  <nav class="admin-nav">
    <RouterLink to="/admin/evenements">Événements</RouterLink>
    <RouterLink to="/admin/artistes">Artistes</RouterLink>
    <RouterLink to="/admin/utilisateurs">Utilisateurs</RouterLink>
    <RouterLink to="/admin/billets">Billets</RouterLink>
  </nav>
</template>

<style scoped>
.admin-nav {
  display: flex;
  gap: var(--spacing-600);
  padding-bottom: var(--spacing-400);
  margin-bottom: var(--spacing-600);
  border-bottom: var(--border-width-050) solid var(--color-text-body);
}
.admin-nav a {
  font-family: var(--font-family-headings);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  color: var(--color-text-secondary);
  padding-bottom: var(--spacing-200);
  border-bottom: var(--border-width-100) solid transparent;
}
.admin-nav a:hover {
  color: var(--color-text-h1);
}
.admin-nav a.router-link-active {
  color: var(--color-text-h1);
  border-bottom-color: var(--color-text-h1);
}
</style>
