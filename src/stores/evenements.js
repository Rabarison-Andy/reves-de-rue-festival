import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { supabase } from '../lib/supabaseClient'
import festivalJson from '../data/festival.json'

export const useEvenementsStore = defineStore('evenements', () => {
  const festival = ref(festivalJson)
  const evenements = ref([])
  const artistes = ref([])
  const partenaires = ref([])
  const chargement = ref(true)
  const erreur = ref(null)

  let promesseChargement = null

  function charger() {
    if (!promesseChargement) {
      promesseChargement = chargerDonnees()
    }
    return promesseChargement
  }

  async function chargerDonnees() {
    chargement.value = true
    erreur.value = null

    try {
      const [evenementsReponse, artistesReponse, sponsorsReponse] = await Promise.all([
        supabase
          .from('evenement')
          .select('id_evenement, titre, description, heure_debut, date_debut, zone, image, phare, categorie(libelle), scene(nom), participation(id_artiste)'),
        supabase.from('artiste').select('id_artiste, nom, genre, biographie, site_web'),
        supabase.from('sponsor').select('nom, logo'),
      ])

      if (evenementsReponse.error) {
        throw evenementsReponse.error
      }
      if (artistesReponse.error) {
        throw artistesReponse.error
      }
      if (sponsorsReponse.error) {
        throw sponsorsReponse.error
      }

      evenements.value = evenementsReponse.data.map((e) => ({
        id: e.id_evenement,
        titre: e.titre,
        description: e.description,
        heureDebut: e.heure_debut,
        date: e.date_debut,
        zone: e.zone,
        image: e.image,
        phare: e.phare,
        type: e.categorie ? e.categorie.libelle : '',
        lieu: e.scene ? e.scene.nom : '',
        artistes: e.participation.map((p) => p.id_artiste),
      }))

      artistes.value = artistesReponse.data.map((a) => ({
        id: a.id_artiste,
        nom: a.nom,
        discipline: a.genre,
        bio: a.biographie,
        siteWeb: a.site_web,
      }))

      partenaires.value = sponsorsReponse.data.map((s) => ({
        nom: s.nom,
        logo: s.logo ? supabase.storage.from('Sponsor').getPublicUrl(s.logo).data.publicUrl : null,
      }))
    } catch (e) {
      console.error('Erreur de chargement des données Supabase :', e.message)
      erreur.value = "Impossible de charger les données du festival. Réessaie dans un instant."
    } finally {
      chargement.value = false
    }
  }

  const evenementsTries = computed(() => {
    return [...evenements.value].sort((a, b) => {
      const dateA = a.date + ' ' + a.heureDebut
      const dateB = b.date + ' ' + b.heureDebut
      return dateA.localeCompare(dateB)
    })
  })

  const evenementsPhares = computed(() => {
    return evenementsTries.value.filter((e) => e.phare === true)
  })

  function artistesDe(evenement) {
    return artistes.value.filter((a) => evenement.artistes.includes(a.id))
  }

  function trouverEvenement(id) {
    return evenements.value.find((e) => e.id === Number(id))
  }

  function suggestionsPour(evenement) {
    const autres = evenementsTries.value.filter((e) => e.id !== evenement.id)
    const memeType = autres.filter((e) => e.type === evenement.type)
    const pasMemeType = autres.filter((e) => e.type !== evenement.type)
    return memeType.concat(pasMemeType).slice(0, 5)
  }

  return {
    festival,
    partenaires,
    chargement,
    erreur,
    evenementsTries,
    evenementsPhares,
    trouverEvenement,
    artistesDe,
    suggestionsPour,
    charger,
  }
})
