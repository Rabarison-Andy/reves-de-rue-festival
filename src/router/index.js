import { createRouter, createWebHistory } from 'vue-router'
import { useEvenementsStore } from '../stores/evenements.js'
import { useAuthStore } from '../stores/auth.js'
import { useFavorisStore } from '../stores/favoris.js'

async function reserveAuxAdmins() {
  const authStore = useAuthStore()
  await authStore.verifierSession()
  if (!authStore.estAdmin) {
    return { name: 'accueil' }
  }
}

const routes = [
  { path: '/', name: 'accueil', component: () => import('../features/accueil/AccueilView.vue') },
  {
    path: '/programmation',
    name: 'programmation',
    component: () => import('../features/programmation/ProgrammationView.vue'),
  },
  {
    path: '/evenement/:id',
    name: 'evenement',
    component: () => import('../features/evenement/EvenementView.vue'),
    props: true,
    beforeEnter: async (to) => {
      const store = useEvenementsStore()
      await store.charger()
      if (!store.trouverEvenement(to.params.id)) {
        return { name: 'programmation' }
      }
    },
  },
  {
    path: '/favoris',
    name: 'favoris',
    component: () => import('../features/favoris/FavorisView.vue'),
    beforeEnter: async () => {
      const evenementsStore = useEvenementsStore()
      const authStore = useAuthStore()
      await evenementsStore.charger()
      await authStore.verifierSession()
      if (authStore.estArtiste) {
        return { name: 'accueil' }
      }
    },
  },
  { path: '/connexion', name: 'connexion', component: () => import('../features/connexion/ConnexionView.vue') },
  {
    path: '/inscription',
    name: 'inscription',
    component: () => import('../features/connexion/InscriptionView.vue'),
  },
  {
    path: '/billetterie',
    name: 'billetterie',
    component: () => import('../features/billetterie/BilletterieView.vue'),
    beforeEnter: async () => {
      const evenementsStore = useEvenementsStore()
      const authStore = useAuthStore()
      const favorisStore = useFavorisStore()
      await evenementsStore.charger()
      await authStore.verifierSession()
      if (!authStore.connecte) {
        return { name: 'connexion' }
      }
      await favorisStore.charger()
    },
  },
  {
    path: '/admin/evenements',
    name: 'admin-evenements',
    component: () => import('../features/admin/AdminEvenementsView.vue'),
    beforeEnter: reserveAuxAdmins,
  },
  {
    path: '/admin/artistes',
    name: 'admin-artistes',
    component: () => import('../features/admin/AdminArtistesView.vue'),
    beforeEnter: reserveAuxAdmins,
  },
  {
    path: '/admin/utilisateurs',
    name: 'admin-utilisateurs',
    component: () => import('../features/admin/AdminUtilisateursView.vue'),
    beforeEnter: reserveAuxAdmins,
  },
  {
    path: '/admin/billets',
    name: 'admin-billets',
    component: () => import('../features/admin/AdminBilletsView.vue'),
    beforeEnter: reserveAuxAdmins,
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
