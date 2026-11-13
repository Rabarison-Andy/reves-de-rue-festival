import { ref, computed, toValue } from 'vue'
import { useEvenementsStore } from '../stores/evenements.js'

export function useFiltresEvenements(source) {
  const evenementsStore = useEvenementsStore()

  const filtres = ref({
    date: '',
    recherche: '',
  })

  const vue = ref('liste')

  function changerFiltre(nom, valeur) {
    filtres.value[nom] = valeur
  }

  const dates = computed(() => {
    const evenements = toValue(source) ?? []
    const liste = []
    for (let i = 0; i < evenements.length; i++) {
      const d = evenements[i].date
      if (!liste.includes(d)) {
        liste.push(d)
      }
    }
    return liste
  })

  const evenementsFiltres = computed(() => {
    let resultat = toValue(source) ?? []

    if (filtres.value.date !== '') {
      resultat = resultat.filter((e) => e.date === filtres.value.date)
    }
    if (filtres.value.recherche !== '') {
      const mot = filtres.value.recherche.toLowerCase()
      resultat = resultat.filter((e) => {
        const noms = evenementsStore.artistesDe(e).map((a) => a.nom).join(' ')
        const texte = (e.titre + ' ' + e.type + ' ' + e.lieu + ' ' + noms).toLowerCase()
        return texte.includes(mot)
      })
    }
    return resultat
  })

  const evenementsParJour = computed(() => {
    const groupes = []
    for (let i = 0; i < evenementsFiltres.value.length; i++) {
      const e = evenementsFiltres.value[i]
      let groupe = groupes.find((g) => g.date === e.date)
      if (!groupe) {
        groupe = { date: e.date, evenements: [] }
        groupes.push(groupe)
      }
      groupe.evenements.push(e)
    }
    return groupes
  })

  return {
    filtres,
    vue,
    changerFiltre,
    dates,
    evenementsFiltres,
    evenementsParJour,
  }
}
