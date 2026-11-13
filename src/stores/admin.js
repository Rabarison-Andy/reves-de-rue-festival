import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { supabase } from '../lib/supabaseClient'

const TAILLE_PAGE = 20

export const useAdminStore = defineStore('admin', () => {
  const scenes = ref([])
  const categories = ref([])
  const artistes = ref([])
  const evenements = ref([])
  const utilisateurs = ref([])
  const billets = ref([])

  const pageEvenements = ref(0)
  const totalEvenements = ref(0)
  const totalPagesEvenements = computed(() => Math.max(1, Math.ceil(totalEvenements.value / TAILLE_PAGE)))

  const pageBillets = ref(0)
  const totalBillets = ref(0)
  const totalPagesBillets = computed(() => Math.max(1, Math.ceil(totalBillets.value / TAILLE_PAGE)))

  async function chargerReferences() {
    const [scenesReponse, categoriesReponse] = await Promise.all([
      supabase.from('scene').select('id_scene, nom').order('nom'),
      supabase.from('categorie').select('id_categorie, libelle').order('libelle'),
    ])
    scenes.value = scenesReponse.data ?? []
    categories.value = categoriesReponse.data ?? []
  }

  async function chargerEvenements(page = 0) {
    const debut = page * TAILLE_PAGE
    const { data, error, count } = await supabase
      .from('evenement')
      .select(
        'id_evenement, titre, description, heure_debut, heure_fin, date_debut, date_fin, zone, image, phare, id_scene, id_categorie, participation(id_artiste)',
        { count: 'estimated' },
      )
      .order('date_debut')
      .range(debut, debut + TAILLE_PAGE - 1)

    if (error) {
      throw new Error(error.message)
    }

    if (data.length === 0 && page > 0) {
      return chargerEvenements(page - 1)
    }

    totalEvenements.value = count ?? 0
    pageEvenements.value = page

    evenements.value = data.map((e) => ({
      id: e.id_evenement,
      titre: e.titre,
      description: e.description,
      heureDebut: e.heure_debut,
      heureFin: e.heure_fin,
      dateDebut: e.date_debut,
      dateFin: e.date_fin,
      zone: e.zone,
      image: e.image,
      phare: e.phare,
      idScene: e.id_scene,
      idCategorie: e.id_categorie,
      artistes: e.participation.map((p) => p.id_artiste),
    }))
  }

  async function enregistrerEvenement(evenement) {
    const ligne = {
      titre: evenement.titre,
      description: evenement.description,
      heure_debut: evenement.heureDebut,
      heure_fin: evenement.heureFin || null,
      date_debut: evenement.dateDebut,
      date_fin: evenement.dateFin || evenement.dateDebut,
      zone: evenement.zone,
      image: evenement.image,
      phare: evenement.phare,
      id_scene: evenement.idScene || null,
      id_categorie: evenement.idCategorie || null,
    }

    let idEvenement = evenement.id

    if (idEvenement) {
      const { error } = await supabase.from('evenement').update(ligne).eq('id_evenement', idEvenement)
      if (error) {
        throw new Error(error.message)
      }
    } else {
      const { data, error } = await supabase.from('evenement').insert(ligne).select('id_evenement').single()
      if (error) {
        throw new Error(error.message)
      }
      idEvenement = data.id_evenement
    }

    const { error: erreurSuppression } = await supabase.from('participation').delete().eq('id_evenement', idEvenement)
    if (erreurSuppression) {
      throw new Error(erreurSuppression.message)
    }

    if (evenement.artistes.length > 0) {
      const lignesParticipation = evenement.artistes.map((idArtiste) => ({
        id_evenement: idEvenement,
        id_artiste: idArtiste,
      }))
      const { error: erreurParticipation } = await supabase.from('participation').insert(lignesParticipation)
      if (erreurParticipation) {
        throw new Error(erreurParticipation.message)
      }
    }

    await chargerEvenements(pageEvenements.value)
  }

  async function supprimerEvenement(id) {
    const { error } = await supabase.from('evenement').delete().eq('id_evenement', id)
    if (error) {
      throw new Error(error.message)
    }
    await chargerEvenements(pageEvenements.value)
  }

  async function chargerArtistes() {
    const { data, error } = await supabase
      .from('artiste')
      .select('id_artiste, nom, biographie, genre, site_web')
      .order('nom')

    if (error) {
      throw new Error(error.message)
    }

    artistes.value = data.map((a) => ({
      id: a.id_artiste,
      nom: a.nom,
      bio: a.biographie,
      discipline: a.genre,
      siteWeb: a.site_web,
    }))
  }

  async function enregistrerArtiste(artiste) {
    const ligne = {
      nom: artiste.nom,
      biographie: artiste.bio,
      genre: artiste.discipline,
      site_web: artiste.siteWeb || null,
    }

    if (artiste.id) {
      const { error } = await supabase.from('artiste').update(ligne).eq('id_artiste', artiste.id)
      if (error) {
        throw new Error(error.message)
      }
    } else {
      const { error } = await supabase.from('artiste').insert(ligne)
      if (error) {
        throw new Error(error.message)
      }
    }

    await chargerArtistes()
  }

  async function supprimerArtiste(id) {
    const { error } = await supabase.from('artiste').delete().eq('id_artiste', id)
    if (error) {
      throw new Error(error.message)
    }
    artistes.value = artistes.value.filter((a) => a.id !== id)
  }

  async function chargerUtilisateurs() {
    const { data, error } = await supabase.from('utilisateur').select('id, nom, email, role').order('nom')

    if (error) {
      throw new Error(error.message)
    }

    utilisateurs.value = data
  }

  async function changerRole(id, role) {
    const { error } = await supabase.from('utilisateur').update({ role }).eq('id', id)
    if (error) {
      throw new Error(error.message)
    }

    const utilisateur = utilisateurs.value.find((u) => u.id === id)
    if (utilisateur) {
      utilisateur.role = role
    }
  }

  async function chargerBillets(page = 0) {
    const debut = page * TAILLE_PAGE
    const { data, error, count } = await supabase
      .from('billet')
      .select('id_billet, numero_billet, prix, nombre_personnes, date_achat, evenement(titre), utilisateur(nom, email)', {
        count: 'estimated',
      })
      .order('date_achat', { ascending: false })
      .range(debut, debut + TAILLE_PAGE - 1)

    if (error) {
      throw new Error(error.message)
    }

    if (data.length === 0 && page > 0) {
      return chargerBillets(page - 1)
    }

    totalBillets.value = count ?? 0
    pageBillets.value = page

    billets.value = data.map((b) => ({
      id: b.id_billet,
      numero: b.numero_billet,
      prix: b.prix,
      nombrePersonnes: b.nombre_personnes,
      dateAchat: b.date_achat,
      evenement: b.evenement ? b.evenement.titre : '',
      acheteur: b.utilisateur ? b.utilisateur.nom || b.utilisateur.email : '',
    }))
  }

  return {
    scenes,
    categories,
    artistes,
    evenements,
    utilisateurs,
    billets,
    pageEvenements,
    totalPagesEvenements,
    pageBillets,
    totalPagesBillets,
    chargerReferences,
    chargerEvenements,
    enregistrerEvenement,
    supprimerEvenement,
    chargerArtistes,
    enregistrerArtiste,
    supprimerArtiste,
    chargerUtilisateurs,
    changerRole,
    chargerBillets,
  }
})
