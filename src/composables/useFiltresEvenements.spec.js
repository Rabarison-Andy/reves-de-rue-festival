import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { useFiltresEvenements } from './useFiltresEvenements.js'
import { useEvenementsStore } from '../stores/evenements.js'

// ARRANGE: données de test partagées
const evenements = [
  { id: 1, titre: 'Fresque en direct', type: 'fresque live', lieu: 'Place du marché', date: '2026-09-22', artistes: [10] },
  { id: 2, titre: 'Concert électro', type: 'concert', lieu: 'Grande scène', date: '2026-09-22', artistes: [] },
  { id: 3, titre: 'Atelier peinture', type: 'atelier', lieu: 'Place du marché', date: '2026-09-23', artistes: [] },
]

// artistesDe() lit l'état interne (privé) du store evenements : on passe par
// le client Supabase mocké et le vrai chargement plutôt que d'ouvrir cet état.
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: (table) => ({
      select: () => {
        if (table === 'artiste') return Promise.resolve({ data: [{ id_artiste: 10, nom: 'Luna Vexa' }], error: null })
        return Promise.resolve({ data: [], error: null })
      },
    }),
  },
}))

describe('useFiltresEvenements', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await useEvenementsStore().charger()
  })

  it('retourne tous les événements sans filtre actif', () => {
    const { evenementsFiltres } = useFiltresEvenements(evenements)
    expect(evenementsFiltres.value).toHaveLength(3)
  })

  it('filtre par date', () => {
    const { filtres, evenementsFiltres, changerFiltre } = useFiltresEvenements(evenements)
    changerFiltre('date', '2026-09-22')
    expect(filtres.value.date).toBe('2026-09-22')
    expect(evenementsFiltres.value.map((e) => e.id)).toEqual([1, 2])
  })

  it('filtre par texte sur le titre, le type ou le lieu', () => {
    const { changerFiltre, evenementsFiltres } = useFiltresEvenements(evenements)
    changerFiltre('recherche', 'électro')
    expect(evenementsFiltres.value.map((e) => e.id)).toEqual([2])
  })

  it('filtre par texte insensible à la casse sur le nom d\'un artiste participant', () => {
    const { changerFiltre, evenementsFiltres } = useFiltresEvenements(evenements)
    changerFiltre('recherche', 'luna')
    expect(evenementsFiltres.value.map((e) => e.id)).toEqual([1])
  })

  it('dates retourne les dates présentes sans doublon', () => {
    const { dates } = useFiltresEvenements(evenements)
    expect(dates.value).toEqual(['2026-09-22', '2026-09-23'])
  })

  it('evenementsParJour groupe les événements filtrés par date', () => {
    const { evenementsParJour } = useFiltresEvenements(evenements)
    expect(evenementsParJour.value).toHaveLength(2)
    expect(evenementsParJour.value[0]).toMatchObject({ date: '2026-09-22' })
    expect(evenementsParJour.value[0].evenements).toHaveLength(2)
  })

  it('réagit quand la source réactive change (toValue)', () => {
    // ARRANGE: la source est un ref, pas un tableau brut
    const source = ref([evenements[0]])
    const { evenementsFiltres } = useFiltresEvenements(source)
    expect(evenementsFiltres.value).toHaveLength(1)

    // ACT: on ajoute un événement dans la source réactive
    source.value = [...source.value, evenements[1]]

    // ASSERT: le composable reflète le nouveau contenu de la source
    expect(evenementsFiltres.value).toHaveLength(2)
  })
})
