import { ref } from 'vue'
import { useBilletsStore } from '../stores/billets.js'
import { useEvenementsFavoris } from './useEvenementsFavoris.js'
import { messageErreur } from '../lib/messageErreur.js'

export function useBilletterie() {
  const { evenementsOptions, estFavori, premierFavori } = useEvenementsFavoris()
  const billetsStore = useBilletsStore()

  const idEvenement = ref(premierFavori.value)
  const nombrePersonnes = ref(1)
  const erreur = ref(null)
  const enCours = ref(false)
  const numeroBillet = ref(null)

  async function valider() {
    if (enCours.value) {
      return
    }

    erreur.value = null
    numeroBillet.value = null
    enCours.value = true
    try {
      numeroBillet.value = await billetsStore.acheterBillet(idEvenement.value, nombrePersonnes.value)
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    } finally {
      enCours.value = false
    }
  }

  return {
    idEvenement,
    nombrePersonnes,
    erreur,
    enCours,
    numeroBillet,
    evenementsOptions,
    estFavori,
    valider,
  }
}
