import { ref, computed } from 'vue'
import { useAdminStore } from '../stores/admin.js'
import { messageErreur } from '../lib/messageErreur.js'

function evenementVide() {
  return {
    id: null,
    titre: '',
    description: '',
    heureDebut: '',
    heureFin: '',
    dateDebut: '',
    dateFin: '',
    zone: '',
    image: '',
    phare: false,
    idScene: '',
    idCategorie: '',
    artistes: [],
  }
}

export function useAdminEvenements() {
  const store = useAdminStore()

  const enEdition = ref(evenementVide())
  const formulaireOuvert = ref(false)
  const erreur = ref(null)
  const enCours = ref(false)

  async function initialiser() {
    try {
      await Promise.all([store.chargerReferences(), store.chargerArtistes(), store.chargerEvenements()])
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  function ouvrirCreation() {
    enEdition.value = evenementVide()
    erreur.value = null
    formulaireOuvert.value = true
  }

  function ouvrirEdition(evenement) {
    enEdition.value = { ...evenement, artistes: [...evenement.artistes] }
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
      await store.enregistrerEvenement(enEdition.value)
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
      await store.supprimerEvenement(id)
    } catch (e) {
      console.error(e.message)
      erreur.value = messageErreur(e)
    }
  }

  async function pageSuivante() {
    if (store.pageEvenements + 1 < store.totalPagesEvenements) {
      await store.chargerEvenements(store.pageEvenements + 1)
    }
  }

  async function pagePrecedente() {
    if (store.pageEvenements > 0) {
      await store.chargerEvenements(store.pageEvenements - 1)
    }
  }

  return {
    evenements: computed(() => store.evenements),
    scenes: computed(() => store.scenes),
    categories: computed(() => store.categories),
    artistes: computed(() => store.artistes),
    page: computed(() => store.pageEvenements),
    totalPages: computed(() => store.totalPagesEvenements),
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
    pageSuivante,
    pagePrecedente,
  }
}
