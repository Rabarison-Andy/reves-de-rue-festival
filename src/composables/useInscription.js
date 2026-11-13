import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { messageErreur } from '../lib/messageErreur.js'

export function useInscription() {
  const nom = ref('')
  const email = ref('')
  const motDePasse = ref('')
  const erreur = ref(null)
  const enCours = ref(false)
  const confirmationRequise = ref(false)

  const store = useAuthStore()
  const router = useRouter()

  async function valider() {
    if (enCours.value) {
      return
    }

    erreur.value = null
    confirmationRequise.value = false
    enCours.value = true
    try {
      const connecteImmediatement = await store.inscription(email.value, motDePasse.value, nom.value)
      if (connecteImmediatement) {
        router.push('/')
      } else {
        confirmationRequise.value = true
      }
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    } finally {
      enCours.value = false
    }
  }

  return {
    nom,
    email,
    motDePasse,
    erreur,
    enCours,
    confirmationRequise,
    valider,
  }
}
