import { ref, computed } from 'vue'
import { useAdminStore } from '../stores/admin.js'
import { messageErreur } from '../lib/messageErreur.js'

function artisteVide() {
  return {
    id: null,
    nom: '',
    bio: '',
    discipline: '',
    siteWeb: '',
  }
}

export function useAdminArtistes() {
  const store = useAdminStore()

  const enEdition = ref(artisteVide())
  const formulaireOuvert = ref(false)
  const erreur = ref(null)
  const enCours = ref(false)

  async function initialiser() {
    try {
      await store.chargerArtistes()
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  function ouvrirCreation() {
    enEdition.value = artisteVide()
    erreur.value = null
    formulaireOuvert.value = true
  }

  function ouvrirEdition(artiste) {
    enEdition.value = { ...artiste }
    erreur.value = null
    formulaireOuvert.value = true
  }

  function fermerFormulaire() {
    formulaireOuvert.value = false
  }

  async function valider() {
    if (enCours.value) {
      return
    }

    erreur.value = null
    enCours.value = true
    try {
      await store.enregistrerArtiste(enEdition.value)
      formulaireOuvert.value = false
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    } finally {
      enCours.value = false
    }
  }

  async function supprimer(id) {
    try {
      await store.supprimerArtiste(id)
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  return {
    artistes: computed(() => store.artistes),
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
  }
}
