export interface Scene {
  id_scene: number
  nom: string
  description: string | null
  capacite: number | null
}

export interface Categorie {
  id_categorie: number
  libelle: string
}

export interface Artiste {
  id_artiste: number
  nom: string
  biographie: string | null
  genre: string | null
  site_web: string | null
}

export interface Utilisateur {
  id_utilisateur: number
  nom: string
  email: string
  mot_de_passe: string
}

export interface Sponsor {
  id_sponsor: number
  nom: string
  logo: string | null
  url: string | null
}

export interface Billet {
  id_billet: number
  numero_billet: string
  prix: number
  nombre_personnes: number
  date_achat: string | null
  id_utilisateur: number
}

export interface Evenement {
  id_evenement: number
  titre: string
  description: string | null
  heure_debut: string | null
  heure_fin: string | null
  date_debut: string
  date_fin: string
  id_scene: number | null
  id_categorie: number | null
  image: string | null
  phare: boolean
  zone: string | null
}

export interface Participation {
  id_evenement: number
  id_artiste: number
}

export interface ProgrammePerso {
  id_utilisateur: number
  id_evenement: number
  date_ajout: string | null
}

export interface Database {
  public: {
    Tables: {
      scene: {
        Row: Scene
        Insert: Partial<Scene>
        Update: Partial<Scene>
      }
      categorie: {
        Row: Categorie
        Insert: Partial<Categorie>
        Update: Partial<Categorie>
      }
      artiste: {
        Row: Artiste
        Insert: Partial<Artiste>
        Update: Partial<Artiste>
      }
      utilisateur: {
        Row: Utilisateur
        Insert: Partial<Utilisateur>
        Update: Partial<Utilisateur>
      }
      sponsor: {
        Row: Sponsor
        Insert: Partial<Sponsor>
        Update: Partial<Sponsor>
      }
      billet: {
        Row: Billet
        Insert: Partial<Billet>
        Update: Partial<Billet>
      }
      evenement: {
        Row: Evenement
        Insert: Partial<Evenement>
        Update: Partial<Evenement>
      }
      participation: {
        Row: Participation
        Insert: Partial<Participation>
        Update: Partial<Participation>
      }
      programme_perso: {
        Row: ProgrammePerso
        Insert: Partial<ProgrammePerso>
        Update: Partial<ProgrammePerso>
      }
    }
  }
}
