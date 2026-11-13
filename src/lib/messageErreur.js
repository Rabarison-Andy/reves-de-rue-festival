export function messageErreur(erreur) {
  const message = erreur?.message ?? ''

  if (message.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect.'
  }
  if (message.includes('already registered')) {
    return 'Un compte existe déjà avec cet email.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Confirme ton email avant de te connecter.'
  }
  if (message.includes('Password should be at least')) {
    return 'Le mot de passe est trop court.'
  }
  if (message.includes('violates row-level security')) {
    return "Tu n'as pas les droits nécessaires pour effectuer cette action."
  }
  if (message.includes('duplicate key value')) {
    return 'Cet élément existe déjà.'
  }
  if (message.includes('violates check constraint')) {
    return "Une des valeurs saisies n'est pas valide."
  }
  if (message.includes('violates not-null constraint')) {
    return 'Un champ obligatoire est manquant.'
  }
  if (message.includes('violates foreign key constraint')) {
    return 'Cet élément est encore utilisé ailleurs et ne peut pas être supprimé.'
  }

  return 'Une erreur est survenue, réessaie dans un instant.'
}
