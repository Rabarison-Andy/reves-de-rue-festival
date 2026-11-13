import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from './auth.js'
import { useEvenementsStore } from './evenements.js'

export const useFavorisStore = defineStore('favoris', () => {
  const authStore = useAuthStore()
  const evenementsStore = useEvenementsStore()

  const ids = ref([])
  const demandeConnexion = ref(false)
  const accesInterdit = ref(false)
  const idsEnCours = ref(new Set())

  async function charger() {
    const { data, error } = await supabase
      .from('programme_perso')
      .select('id_evenement')
      .order('date_ajout')

    if (error) {
      console.error('Erreur de chargement des favoris :', error.message)
      return
    }

    ids.value = data.map((ligne) => ligne.id_evenement)
  }

  function vider() {
    ids.value = []
  }

  watch(
    () => authStore.connecte,
    (connecte) => {
      if (connecte) {
        charger()
      } else {
        vider()
      }
    },
    { immediate: true },
  )

  function fermerPopup() {
    demandeConnexion.value = false
    accesInterdit.value = false
  }

  function estFavori(id) {
    return ids.value.includes(Number(id))
  }

  function estEnCours(id) {
    return idsEnCours.value.has(Number(id))
  }

  async function basculer(id) {
    if (!authStore.connecte) {
      demandeConnexion.value = true
      return
    }

    if (authStore.estArtiste) {
      accesInterdit.value = true
      return
    }

    id = Number(id)
    if (idsEnCours.value.has(id)) {
      return
    }
    idsEnCours.value.add(id)

    try {
      const dejaFavori = ids.value.includes(id)

      if (dejaFavori) {
        ids.value = ids.value.filter((i) => i !== id)
        const { error } = await supabase
          .from('programme_perso')
          .delete()
          .eq('id_evenement', id)
        if (error) {
          console.error('Erreur en retirant le favori :', error.message)
          ids.value.push(id)
        }
      } else {
        ids.value.push(id)
        const { error } = await supabase
          .from('programme_perso')
          .insert({ id_evenement: id, id_utilisateur: authStore.utilisateur.id })
        if (error) {
          console.error('Erreur en ajoutant le favori :', error.message)
          ids.value = ids.value.filter((i) => i !== id)
        }
      }
    } finally {
      idsEnCours.value.delete(id)
    }
  }

  const evenements = computed(() => {
    return ids.value.map((id) => evenementsStore.trouverEvenement(id)).filter((e) => e !== undefined)
  })

  return {
    ids,
    demandeConnexion,
    accesInterdit,
    fermerPopup,
    estFavori,
    estEnCours,
    basculer,
    evenements,
    charger,
  }
})
