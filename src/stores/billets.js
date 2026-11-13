import { defineStore } from 'pinia'

import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from './auth.js'

export const useBilletsStore = defineStore('billets', () => {
  const authStore = useAuthStore()

  async function acheterBillet(idEvenement, nombrePersonnes) {
    const { data, error } = await supabase
      .from('billet')
      .insert({
        nombre_personnes: nombrePersonnes,
        id_evenement: idEvenement,
        id_utilisateur: authStore.utilisateur.id,
      })
      .select('numero_billet')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data.numero_billet
  }

  return {
    acheterBillet,
  }
})
