import { ref, computed } from 'vue'
import { useAdminStore } from '../stores/admin.js'
import { messageErreur } from '../lib/messageErreur.js'

export function useAdminBillets() {
  const store = useAdminStore()
  const erreur = ref(null)

  async function initialiser() {
    try {
      await store.chargerBillets()
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  async function pageSuivante() {
    if (store.pageBillets + 1 < store.totalPagesBillets) {
      await store.chargerBillets(store.pageBillets + 1)
    }
  }

  async function pagePrecedente() {
    if (store.pageBillets > 0) {
      await store.chargerBillets(store.pageBillets - 1)
    }
  }

  return {
    billets: computed(() => store.billets),
    page: computed(() => store.pageBillets),
    totalPages: computed(() => store.totalPagesBillets),
    erreur,
    initialiser,
    pageSuivante,
    pagePrecedente,
  }
}
