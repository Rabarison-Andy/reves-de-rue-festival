import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import BoutonFavori from './BoutonFavori.vue'
import { useFavorisStore } from '../stores/favoris.js'

describe('BoutonFavori', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("n'est pas activé par défaut", () => {
    // ACT: monter le composant
    const wrapper = mount(BoutonFavori, { props: { id: 1 } })

    // ASSERT: l'étoile n'est pas encore cochée
    expect(wrapper.attributes('aria-pressed')).toBe('false')
  })

  it("demande une connexion au clic si personne n'est connecté", async () => {
    // ARRANGE: monter le composant, personne n'est connecté dans ce test
    const wrapper = mount(BoutonFavori, { props: { id: 1 } })
    const store = useFavorisStore()

    // ACT: cliquer sur l'étoile
    await wrapper.trigger('click')

    // ASSERT: l'étoile reste désactivée, la popup de connexion est demandée
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(store.demandeConnexion).toBe(true)
  })
})
