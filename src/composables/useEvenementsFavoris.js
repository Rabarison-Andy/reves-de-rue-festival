import { computed } from 'vue'
import { useEvenementsStore } from '../stores/evenements.js'
import { useFavorisStore } from '../stores/favoris.js'

export function useEvenementsFavoris() {
  const evenementsStore = useEvenementsStore()
  const favorisStore = useFavorisStore()

  const evenementsOptions = computed(() => {
    return [...evenementsStore.evenementsTries].sort((a, b) => {
      const aFavori = favorisStore.estFavori(a.id) ? 0 : 1
      const bFavori = favorisStore.estFavori(b.id) ? 0 : 1
      return aFavori - bFavori
    })
  })

  function estFavori(id) {
    return favorisStore.estFavori(id)
  }

  const premierFavori = computed(() => favorisStore.evenements[0]?.id ?? '')

  return {
    evenementsOptions,
    estFavori,
    premierFavori,
  }
}
