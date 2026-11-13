import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

import { supabase } from '../lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const profil = ref(null)

  const utilisateur = computed(() => session.value?.user ?? null)
  const connecte = computed(() => session.value !== null)
  const estArtiste = computed(() => profil.value?.role === 'artiste')
  const estAdmin = computed(() => profil.value?.role === 'admin')

  function initialiser() {
    supabase.auth.onAuthStateChange((_evenement, nouvelleSession) => {
      session.value = nouvelleSession
    })
  }

  async function verifierSession() {
    if (session.value === null) {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
    }
    if (session.value && !profil.value) {
      await chargerProfil(session.value.user.id)
    }
  }

  let promesseProfil = null

  function chargerProfil(id) {
    if (!promesseProfil) {
      promesseProfil = chargerProfilDepuisSupabase(id).finally(() => {
        promesseProfil = null
      })
    }
    return promesseProfil
  }

  async function chargerProfilDepuisSupabase(id) {
    const { data, error } = await supabase
      .from('utilisateur')
      .select('role')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erreur de chargement du profil :', error.message)
      return
    }

    profil.value = data
  }

  watch(
    () => session.value?.user?.id,
    (id) => {
      if (id) {
        chargerProfil(id)
      } else {
        profil.value = null
      }
    },
    { immediate: true },
  )

  async function connexion(email, motDePasse) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })

    if (error) {
      throw new Error(error.message)
    }

    session.value = data.session
  }

  async function inscription(email, motDePasse, nom) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { nom },
        emailRedirectTo: window.location.origin + import.meta.env.BASE_URL,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    session.value = data.session
    return data.session !== null
  }

  async function deconnexion() {
    await supabase.auth.signOut()
    session.value = null
  }

  return {
    utilisateur,
    profil,
    connecte,
    estArtiste,
    estAdmin,
    initialiser,
    verifierSession,
    connexion,
    inscription,
    deconnexion,
  }
})
