import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { messageErreur } from '../lib/messageErreur.js'

export function useConnexion() {
  const email = ref('')
  const motDePasse = ref('')
  const erreur = ref(null)
  const enCours = ref(false)

  const store = useAuthStore()
  const router = useRouter()

  async function valider() {
    if (enCours.value) {
      return
    }

    erreur.value = null
    enCours.value = true
    try {
      await store.connexion(email.value, motDePasse.value)
      router.push('/')
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    } finally {
      enCours.value = false
    }
  }

  return {
    email,
    motDePasse,
    erreur,
    enCours,
    valider,
  }
}
