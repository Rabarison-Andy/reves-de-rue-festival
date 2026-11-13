import { describe, it, expect } from 'vitest'
import { messageErreur } from './messageErreur.js'

describe('messageErreur', () => {
  it('traduit un mauvais mot de passe', () => {
    expect(messageErreur(new Error('Invalid login credentials'))).toBe('Email ou mot de passe incorrect.')
  })

  it('traduit un email déjà utilisé', () => {
    expect(messageErreur(new Error('User already registered'))).toBe('Un compte existe déjà avec cet email.')
  })

  it('traduit une violation de contrainte unique', () => {
    expect(messageErreur(new Error('duplicate key value violates unique constraint "billet_numero_billet_key"'))).toBe(
      'Cet élément existe déjà.',
    )
  })

  it('traduit une violation de RLS', () => {
    expect(messageErreur(new Error('new row violates row-level security policy for table "billet"'))).toBe(
      "Tu n'as pas les droits nécessaires pour effectuer cette action.",
    )
  })

  it('retourne un message générique pour une erreur inconnue', () => {
    expect(messageErreur(new Error('timeout exceeded'))).toBe('Une erreur est survenue, réessaie dans un instant.')
  })

  it('ne plante pas si aucune erreur ou un message absent est fourni', () => {
    expect(messageErreur(undefined)).toBe('Une erreur est survenue, réessaie dans un instant.')
    expect(messageErreur({})).toBe('Une erreur est survenue, réessaie dans un instant.')
  })
})
