import { Commentaire } from "../types";

const STORAGE_KEY = 'mawkzy-remerciements-commentaires';
const ADMIN_KEY = 'mawkzy-admin-key';
const ADMIN_ATTEMPTS_KEY = 'mawkzy-admin-attempts';
const MAX_ATTEMPTS = 5; // Maximum de tentatives avant le blocage
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes

// Clé par défaut (à changer après la première utilisation)
const DEFAULT_ADMIN_KEY = 'mawkzy-admin-2024';

// Statuts de modération
export enum StatutModeration {
  EN_ATTENTE = 'en_attente',
  APPROUVE = 'approuve',
  REJETE = 'rejete'
}

// Version étendue de l'interface Commentaire avec statut de modération
export interface CommentaireAvecModeration extends Commentaire {
  statut: StatutModeration;
  raison_rejet?: string;
  date_moderation?: string;
}

// Liste des mots à filtrer (insultes, termes négatifs)
const MOTS_INTERDITS = [
  // Insultes générales
  'connard', 'connasse', 'con', 'salope', 'pute', 'putain', 'merde', 
  'enculé', 'enculer', 'pd', 'fdp', 'fils de pute', 'bâtard', 'batard',
  'cul', 'bite', 'couille', 'nichon', 'niquer', 'nique', 'ntm',
  'tg', 'ta gueule', 'ferme ta gueule', 'ferme la', 
  
  // Insultes plus spécifiques
  'noob', 'nul', 'pourri', 'mauvais', 'débile', 'débil', 'stupide', 'idiot',
  'mongol', 'attardé', 'attardé', 'handicapé', 'retardé',
  
  // Phrases négatives
  't\'es nul', 'tu es nul', 'trop nul', 'tellement nul',
  't\'es mauvais', 'tu es mauvais', 'trop mauvais', 'tellement mauvais',
  't\'es pourri', 'tu es pourri', 'trop pourri', 'tellement pourri',
  'casse toi', 'dégage', 'arrête de', 'stop le stream', 'change de jeu',
  'joue pas à', 'joue mieux'
];

// Expressions régulières pour détecter les patterns plus complexes
const PATTERNS_INTERDITS = [
  /\b(mawkzy|tu|t'es).{0,10}(nul|mauvais|pourri|bête|débile|stupide|idiot|bad|worst|horrible|terrible)\b/i,
  /\barrête\s+de\s+(jouer|stream|faire)\b/i,
  /\bpas\s+(bon|fort|capable|doué)\b/i,
  /\b(change|arrête|stop)\s+de\s+(jeu|stream|jouer)\b/i,
  /\bdégage\b/i,
  /\bcasse[\s-]toi\b/i,
  /\bne\s+sais\s+pas\s+jouer\b/i,
  /\bjoue\s+comme\s+(de la merde|un enfant|une merde)\b/i
];

/**
 * Vérifie si un message contient des mots interdits ou correspond à des patterns interdits
 * @param message Le message à vérifier
 * @returns true si le message est inapproprié, false sinon
 */
export const contientContenuInapproprie = (message: string): boolean => {
  const messageLower = message.toLowerCase();
  
  // Vérification des mots interdits
  for (const mot of MOTS_INTERDITS) {
    if (messageLower.includes(mot.toLowerCase())) {
      console.log(`Message filtré - Contient le mot interdit: ${mot}`);
      return true;
    }
  }
  
  // Vérification des patterns interdits
  for (const pattern of PATTERNS_INTERDITS) {
    if (pattern.test(messageLower)) {
      console.log(`Message filtré - Correspond au pattern interdit: ${pattern}`);
      return true;
    }
  }
  
  return false;
};

/**
 * Vérifie si l'accès à l'administration est bloqué
 * @returns {boolean} true si l'accès est bloqué, false sinon
 */
const estBloque = (): boolean => {
  try {
    const attemptsData = localStorage.getItem(ADMIN_ATTEMPTS_KEY);
    if (!attemptsData) return false;
    
    const { timestamp, blocked } = JSON.parse(attemptsData);
    
    if (blocked) {
      const now = Date.now();
      const blockEndTime = timestamp + BLOCK_DURATION;
      
      if (now < blockEndTime) {
        return true;
      } else {
        // Réinitialiser le blocage si le temps est écoulé
        resetAttempts();
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification du blocage:", error);
    return false;
  }
};

/**
 * Récupère le temps restant avant la fin du blocage en minutes
 * @returns {number} le temps restant en minutes
 */
export const getTempsRestantBlocage = (): number => {
  try {
    const attemptsData = localStorage.getItem(ADMIN_ATTEMPTS_KEY);
    if (!attemptsData) return 0;
    
    const { timestamp, blocked } = JSON.parse(attemptsData);
    
    if (blocked) {
      const now = Date.now();
      const blockEndTime = timestamp + BLOCK_DURATION;
      
      if (now < blockEndTime) {
        return Math.ceil((blockEndTime - now) / (60 * 1000)); // Conversion en minutes
      }
    }
    
    return 0;
  } catch (error) {
    console.error("Erreur lors du calcul du temps de blocage:", error);
    return 0;
  }
};

/**
 * Enregistre une tentative d'authentification échouée
 */
const enregistrerTentativeEchouee = (): void => {
  try {
    const attemptsData = localStorage.getItem(ADMIN_ATTEMPTS_KEY);
    let currentAttempts = 0;
    
    if (attemptsData) {
      const data = JSON.parse(attemptsData);
      currentAttempts = data.attempts || 0;
    }
    
    currentAttempts += 1;
    const blocked = currentAttempts >= MAX_ATTEMPTS;
    
    localStorage.setItem(ADMIN_ATTEMPTS_KEY, JSON.stringify({
      attempts: currentAttempts,
      timestamp: Date.now(),
      blocked
    }));
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la tentative:", error);
  }
};

/**
 * Réinitialise les tentatives d'authentification
 */
const resetAttempts = (): void => {
  try {
    localStorage.setItem(ADMIN_ATTEMPTS_KEY, JSON.stringify({
      attempts: 0,
      timestamp: Date.now(),
      blocked: false
    }));
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des tentatives:", error);
  }
};

/**
 * Charge les commentaires depuis le localStorage
 * @param inclureRejetes Indique si les commentaires rejetés doivent être inclus (par défaut: false)
 * @param modeAdmin Indique si on est en mode admin (inclut tous les commentaires)
 */
export const loadCommentaires = (inclureRejetes: boolean = false, modeAdmin: boolean = false): CommentaireAvecModeration[] => {
  try {
    const savedCommentaires = localStorage.getItem(STORAGE_KEY);
    const commentaires: CommentaireAvecModeration[] = savedCommentaires ? JSON.parse(savedCommentaires) : [];
    
    if (modeAdmin) {
      return commentaires;
    }
    
    return commentaires.filter(comm => 
      comm.statut === StatutModeration.APPROUVE || 
      (inclureRejetes && comm.statut === StatutModeration.REJETE)
    );
  } catch (error) {
    console.error("Erreur lors du chargement des commentaires:", error);
    return [];
  }
};

/**
 * Sauvegarde les commentaires dans le localStorage
 */
export const saveCommentaires = (commentaires: CommentaireAvecModeration[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(commentaires));
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des commentaires:", error);
    return false;
  }
};

/**
 * Ajoute un nouveau commentaire après vérification du contenu
 * @returns Un objet {commentaire, estInapproprie} avec le commentaire créé et un booléen indiquant si le contenu est inapproprié
 */
export const addCommentaire = (auteur: string, message: string): { commentaire: CommentaireAvecModeration | null, estInapproprie: boolean } => {
  // Vérification du contenu du message
  if (contientContenuInapproprie(message)) {
    return { commentaire: null, estInapproprie: true };
  }
  
  const nouveauCommentaire: CommentaireAvecModeration = {
    id: `commentaire-${Date.now()}`,
    auteur: auteur.trim(),
    message: message.trim(),
    date: new Date().toISOString(),
    statut: StatutModeration.EN_ATTENTE
  };
  
  const commentaires = loadCommentaires(false, true);
  const updatedCommentaires = [nouveauCommentaire, ...commentaires];
  saveCommentaires(updatedCommentaires);
  
  return { commentaire: nouveauCommentaire, estInapproprie: false };
};

/**
 * Approuve un commentaire
 * @param commentaireId ID du commentaire à approuver
 * @returns true si l'opération a réussi, false sinon
 */
export const approuverCommentaire = (commentaireId: string): boolean => {
  const commentaires = loadCommentaires(false, true);
  const index = commentaires.findIndex(c => c.id === commentaireId);
  
  if (index === -1) return false;
  
  commentaires[index].statut = StatutModeration.APPROUVE;
  commentaires[index].date_moderation = new Date().toISOString();
  
  return saveCommentaires(commentaires);
};

/**
 * Rejette un commentaire
 * @param commentaireId ID du commentaire à rejeter
 * @param raison Raison du rejet (optionnel)
 * @returns true si l'opération a réussi, false sinon
 */
export const rejeterCommentaire = (commentaireId: string, raison?: string): boolean => {
  const commentaires = loadCommentaires(false, true);
  const index = commentaires.findIndex(c => c.id === commentaireId);
  
  if (index === -1) return false;
  
  commentaires[index].statut = StatutModeration.REJETE;
  commentaires[index].raison_rejet = raison;
  commentaires[index].date_moderation = new Date().toISOString();
  
  return saveCommentaires(commentaires);
};

/**
 * Vérifie si l'utilisateur est administrateur
 * @param cle Clé d'administration
 * @returns true si la clé est valide, false sinon
 */
export const estAdministrateur = (cle: string): boolean => {
  // Vérifier si l'accès est bloqué
  if (estBloque()) {
    return false;
  }

  try {
    // Récupérer la clé admin du localStorage ou utiliser la clé par défaut
    const storedCle = localStorage.getItem(ADMIN_KEY);
    
    // Vérifier si la clé correspond
    const isValid = storedCle 
      ? cle === storedCle 
      : cle === DEFAULT_ADMIN_KEY;
    
    if (isValid) {
      // Réinitialiser les tentatives en cas de succès
      resetAttempts();
      
      // Si c'est la première connexion, sauvegarder la clé par défaut
      if (!storedCle) {
        localStorage.setItem(ADMIN_KEY, DEFAULT_ADMIN_KEY);
      }
      
      return true;
    } else {
      // Enregistrer une tentative échouée
      enregistrerTentativeEchouee();
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'administrateur:", error);
    return false;
  }
};

/**
 * Définit une nouvelle clé d'administration
 * @param ancienneCle Clé d'administration actuelle
 * @param nouvelleCle Nouvelle clé d'administration
 * @returns true si l'opération a réussi, false sinon
 */
export const definirCleAdmin = (ancienneCle: string, nouvelleCle: string): boolean => {
  if (!estAdministrateur(ancienneCle)) return false;
  
  try {
    localStorage.setItem(ADMIN_KEY, nouvelleCle);
    return true;
  } catch (error) {
    console.error("Erreur lors de la définition de la clé admin:", error);
    return false;
  }
};

/**
 * Récupère les statistiques de commentaires
 * @returns Statistiques sur les commentaires
 */
export const getStatistiquesCommentaires = (): { total: number, enAttente: number, approuves: number, rejetes: number } => {
  const commentaires = loadCommentaires(false, true);
  
  return {
    total: commentaires.length,
    enAttente: commentaires.filter(c => c.statut === StatutModeration.EN_ATTENTE).length,
    approuves: commentaires.filter(c => c.statut === StatutModeration.APPROUVE).length,
    rejetes: commentaires.filter(c => c.statut === StatutModeration.REJETE).length
  };
};

/**
 * Formate une date pour l'affichage
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Supprime complètement un commentaire
 * @param commentaireId ID du commentaire à supprimer
 * @returns true si l'opération a réussi, false sinon
 */
export const supprimerCommentaire = (commentaireId: string): boolean => {
  const commentaires = loadCommentaires(false, true);
  const index = commentaires.findIndex(c => c.id === commentaireId);
  
  if (index === -1) return false;
  
  commentaires.splice(index, 1);
  
  return saveCommentaires(commentaires);
}; 