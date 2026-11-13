import { ref, computed } from 'vue'
import { useAdminStore } from '../stores/admin.js'
import { messageErreur } from '../lib/messageErreur.js'

export function useAdminUtilisateurs() {
  const store = useAdminStore()
  const erreur = ref(null)

  async function initialiser() {
    try {
      await store.chargerUtilisateurs()
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  async function changerRole(id, role) {
    erreur.value = null
    try {
      await store.changerRole(id, role)
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  return {
    utilisateurs: computed(() => store.utilisateurs),
    erreur,
    initialiser,
    changerRole,
  }
}
