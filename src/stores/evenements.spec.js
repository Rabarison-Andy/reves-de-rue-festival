import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useEvenementsStore } from './evenements.js'

// ARRANGE: données brutes au format renvoyé par Supabase (snake_case),
// volontairement dans le désordre pour vérifier le tri du store.
const evenementsBruts = [
  {
    id_evenement: 1,
    titre: 'Atelier du matin',
    description: '',
    heure_debut: '10:00',
    date_debut: '2026-09-22',
    zone: '',
    image: '',
    phare: false,
    categorie: { libelle: 'Atelier' },
    scene: null,
    participation: [],
  },
  {
    id_evenement: 2,
    titre: 'Concert phare',
    description: '',
    heure_debut: '21:00',
    date_debut: '2026-09-22',
    zone: '',
    image: '',
    phare: true,
    categorie: { libelle: 'Concert' },
    scene: null,
    participation: [],
  },
  {
    id_evenement: 3,
    titre: 'Ouverture',
    description: '',
    heure_debut: '09:00',
    date_debut: '2026-09-22',
    zone: '',
    image: '',
    phare: false,
    categorie: { libelle: 'Concert' },
    scene: null,
    participation: [],
  },
  {
    id_evenement: 4,
    titre: 'Fresque du lendemain',
    description: '',
    heure_debut: '14:00',
    date_debut: '2026-09-23',
    zone: '',
    image: '',
    phare: false,
    categorie: { libelle: 'Fresque live' },
    scene: null,
    participation: [],
  },
]

// On passe par le client Supabase mocké plutôt que d'ouvrir l'état interne
// du store : ça teste le vrai chemin public (charger -> mapping -> computed).
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: (table) => ({
      select: () => {
        if (table === 'evenement') return Promise.resolve({ data: evenementsBruts, error: null })
        return Promise.resolve({ data: [], error: null })
      },
    }),
  },
}))

describe('evenements store', () => {
  let store

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = useEvenementsStore()
    await store.charger()
  })

  it('evenementsTries trie par date puis par heure de début', () => {
    expect(store.evenementsTries.map((e) => e.id)).toEqual([3, 1, 2, 4])
  })

  it('evenementsPhares ne garde que les événements marqués phare', () => {
    expect(store.evenementsPhares.map((e) => e.id)).toEqual([2])
  })

  it('trouverEvenement retrouve un événement par id, même passé en chaîne', () => {
    expect(store.trouverEvenement(2)?.titre).toBe('Concert phare')
    expect(store.trouverEvenement('2')?.titre).toBe('Concert phare')
    expect(store.trouverEvenement(999)).toBeUndefined()
  })

  it("suggestionsPour priorise le même type, exclut l'événement et limite à 5", () => {
    const suggestions = store.suggestionsPour(store.trouverEvenement(3)) // "Ouverture", type Concert
    expect(suggestions.map((e) => e.id)).not.toContain(3)
    expect(suggestions[0].id).toBe(2) // même type "Concert" en premier
    expect(suggestions).toHaveLength(3) // les 3 autres événements du jeu de test
  })
})
