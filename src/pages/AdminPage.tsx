import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaLock, FaShieldAlt, FaSignOutAlt, FaExclamationTriangle, FaKey, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PageBanner from '../components/common/PageBanner';
import { loadCommentaires, approuverCommentaire, rejeterCommentaire, estAdministrateur, getStatistiquesCommentaires, StatutModeration, CommentaireAvecModeration, formatDate, getTempsRestantBlocage, definirCleAdmin, supprimerCommentaire } from '../utils/commentairesManager';
import './AdminPage.scss';

const AdminPage: React.FC = () => {
  const [commentaires, setCommentaires] = useState<CommentaireAvecModeration[]>([]);
  const [cleAdmin, setCleAdmin] = useState('');
  const [estConnecte, setEstConnecte] = useState(false);
  const [erreurAuthentification, setErreurAuthentification] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<StatutModeration | 'tous'>('tous');
  const [statistiques, setStatistiques] = useState<{ total: number, enAttente: number, approuves: number, rejetes: number }>({ total: 0, enAttente: 0, approuves: 0, rejetes: 0 });
  const [raisonRejet, setRaisonRejet] = useState('');
  const [commentaireAModerer, setCommentaireAModerer] = useState<string | null>(null);
  const [actionModeration, setActionModeration] = useState<'approuver' | 'rejeter' | null>(null);
  const [accesBloque, setAccesBloque] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(0);
  const [showChangeKeyModal, setShowChangeKeyModal] = useState(false);
  const [ancienneCle, setAncienneCle] = useState('');
  const [nouvelleCle, setNouvelleCle] = useState('');
  const [confirmationCle, setConfirmationCle] = useState('');
  const [messageChangementCle, setMessageChangementCle] = useState({ text: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentaireASupprimer, setCommentaireASupprimer] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Vérifier si l'accès est bloqué
  useEffect(() => {
    const temps = getTempsRestantBlocage();
    if (temps > 0) {
      setAccesBloque(true);
      setTempsRestant(temps);
      
      // Mettre à jour le temps restant toutes les minutes
      const interval = setInterval(() => {
        const updatedTime = getTempsRestantBlocage();
        setTempsRestant(updatedTime);
        
        if (updatedTime <= 0) {
          setAccesBloque(false);
          clearInterval(interval);
        }
      }, 60000); // 1 minute
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // Charger les commentaires si l'admin est connecté
  useEffect(() => {
    if (estConnecte) {
      const tousLesCommentaires = loadCommentaires(true, true);
      setCommentaires(tousLesCommentaires);
      setStatistiques(getStatistiquesCommentaires());
    }
  }, [estConnecte]);
  
  // Filtrer les commentaires
  const commentairesFiltres = commentaires.filter(commentaire => 
    filtreStatut === 'tous' || commentaire.statut === filtreStatut
  );
  
  // Gérer la connexion admin
  const handleConnexion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (estAdministrateur(cleAdmin)) {
      setEstConnecte(true);
      setErreurAuthentification('');
    } else {
      setErreurAuthentification('Clé d\'administration invalide. Veuillez réessayer.');
      
      // Vérifier si l'accès est maintenant bloqué
      const temps = getTempsRestantBlocage();
      if (temps > 0) {
        setAccesBloque(true);
        setTempsRestant(temps);
      }
    }
  };
  
  // Déconnexion
  const handleDeconnexion = () => {
    setEstConnecte(false);
    setCleAdmin('');
    navigate('/'); // Rediriger vers la page d'accueil
  };
  
  // Ouvrir la modal de modération
  const ouvrirModalModeration = (commentaireId: string, action: 'approuver' | 'rejeter') => {
    setCommentaireAModerer(commentaireId);
    setActionModeration(action);
    
    if (action === 'rejeter') {
      setRaisonRejet('');
    }
  };
  
  // Fermer la modal
  const fermerModal = () => {
    setCommentaireAModerer(null);
    setActionModeration(null);
    setRaisonRejet('');
  };
  
  // Fermer la modal de changement de clé
  const fermerModalChangementCle = () => {
    setShowChangeKeyModal(false);
    setAncienneCle('');
    setNouvelleCle('');
    setConfirmationCle('');
    setMessageChangementCle({ text: '', type: '' });
  };
  
  // Changer la clé d'administration
  const handleChangerCle = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les deux champs correspondent
    if (nouvelleCle !== confirmationCle) {
      setMessageChangementCle({ 
        text: 'Les deux clés ne correspondent pas. Veuillez réessayer.', 
        type: 'error' 
      });
      return;
    }
    
    // Vérifier que la nouvelle clé est assez longue (min 8 caractères)
    if (nouvelleCle.length < 8) {
      setMessageChangementCle({ 
        text: 'La nouvelle clé doit contenir au moins 8 caractères.', 
        type: 'error' 
      });
      return;
    }
    
    // Changer la clé
    if (definirCleAdmin(ancienneCle, nouvelleCle)) {
      setMessageChangementCle({ 
        text: 'Clé d\'administration modifiée avec succès !', 
        type: 'success' 
      });
      
      // Fermer la modal après 2 secondes
      setTimeout(() => {
        fermerModalChangementCle();
      }, 2000);
    } else {
      setMessageChangementCle({ 
        text: 'Erreur lors du changement de clé. Vérifiez votre clé actuelle.', 
        type: 'error' 
      });
    }
  };
  
  // Effectuer l'action de modération
  const effectuerModeration = () => {
    if (!commentaireAModerer) return;
    
    if (actionModeration === 'approuver') {
      if (approuverCommentaire(commentaireAModerer)) {
        // Rafraîchir les commentaires
        const tousLesCommentaires = loadCommentaires(true, true);
        setCommentaires(tousLesCommentaires);
        setStatistiques(getStatistiquesCommentaires());
      }
    } else if (actionModeration === 'rejeter') {
      if (rejeterCommentaire(commentaireAModerer, raisonRejet)) {
        // Rafraîchir les commentaires
        const tousLesCommentaires = loadCommentaires(true, true);
        setCommentaires(tousLesCommentaires);
        setStatistiques(getStatistiquesCommentaires());
      }
    }
    
    fermerModal();
  };
  
  // Ouvrir la modal de suppression
  const ouvrirModalSuppression = (commentaireId: string) => {
    setCommentaireASupprimer(commentaireId);
    setShowDeleteModal(true);
  };
  
  // Fermer la modal de suppression
  const fermerModalSuppression = () => {
    setCommentaireASupprimer(null);
    setShowDeleteModal(false);
  };
  
  // Effectuer la suppression
  const effectuerSuppression = () => {
    if (!commentaireASupprimer) return;
    
    if (supprimerCommentaire(commentaireASupprimer)) {
      // Rafraîchir les commentaires
      const tousLesCommentaires = loadCommentaires(true, true);
      setCommentaires(tousLesCommentaires);
      setStatistiques(getStatistiquesCommentaires());
    }
    
    fermerModalSuppression();
  };
  
  // Obtenir la classe CSS en fonction du statut
  const getStatutClass = (statut: StatutModeration) => {
    switch(statut) {
      case StatutModeration.APPROUVE:
        return 'statut-approuve';
      case StatutModeration.REJETE:
        return 'statut-rejete';
      case StatutModeration.EN_ATTENTE:
        return 'statut-en-attente';
      default:
        return '';
    }
  };
  
  // Obtenir le libellé du statut
  const getStatutLibelle = (statut: StatutModeration) => {
    switch(statut) {
      case StatutModeration.APPROUVE:
        return 'Approuvé';
      case StatutModeration.REJETE:
        return 'Rejeté';
      case StatutModeration.EN_ATTENTE:
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="admin-page">
      <PageBanner 
        title="Administration" 
        subtitle="Modération des commentaires" 
      />
      
      <div className="container main-content">
        {!estConnecte ? (
          <motion.div 
            className="login-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="login-card">
              <div className="login-header">
                <FaShieldAlt className="shield-icon" />
                <h2>Authentification</h2>
                <p>Veuillez entrer la clé d'administration pour accéder à la modération</p>
              </div>
              
              {accesBloque ? (
                <div className="access-blocked">
                  <FaExclamationTriangle className="warning-icon" />
                  <h3>Accès temporairement bloqué</h3>
                  <p>
                    Trop de tentatives d'authentification incorrectes.
                    <br />
                    Veuillez réessayer dans <strong>{tempsRestant} minute{tempsRestant > 1 ? 's' : ''}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConnexion}>
                  <div className="form-group">
                    <label htmlFor="cleAdmin">Clé d'administration</label>
                    <div className="password-input">
                      <FaLock className="input-icon" />
                      <input
                        type="password"
                        id="cleAdmin"
                        value={cleAdmin}
                        onChange={(e) => setCleAdmin(e.target.value)}
                        required
                        placeholder="Entrez la clé d'administration"
                      />
                    </div>
                  </div>
                  
                  {erreurAuthentification && (
                    <div className="auth-error">
                      {erreurAuthentification}
                    </div>
                  )}
                  
                  <motion.button 
                    type="submit"
                    className="submit-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Se connecter
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="moderation-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="admin-header">
              <h2>Modération des commentaires</h2>
              <div className="admin-actions">
                <motion.button 
                  className="change-key-button"
                  onClick={() => setShowChangeKeyModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaKey />
                  <span>Changer la clé</span>
                </motion.button>
                <motion.button 
                  className="logout-button"
                  onClick={handleDeconnexion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </motion.button>
              </div>
            </div>
            
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-value">{statistiques.total}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card waiting">
                <div className="stat-value">{statistiques.enAttente}</div>
                <div className="stat-label">En attente</div>
              </div>
              <div className="stat-card approved">
                <div className="stat-value">{statistiques.approuves}</div>
                <div className="stat-label">Approuvés</div>
              </div>
              <div className="stat-card rejected">
                <div className="stat-value">{statistiques.rejetes}</div>
                <div className="stat-label">Rejetés</div>
              </div>
            </div>
            
            <div className="filter-section">
              <span>Filtrer par statut:</span>
              <div className="filter-buttons">
                <button 
                  className={filtreStatut === 'tous' ? 'active' : ''}
                  onClick={() => setFiltreStatut('tous')}
                >
                  Tous
                </button>
                <button 
                  className={filtreStatut === StatutModeration.EN_ATTENTE ? 'active' : ''}
                  onClick={() => setFiltreStatut(StatutModeration.EN_ATTENTE)}
                >
                  En attente
                </button>
                <button 
                  className={filtreStatut === StatutModeration.APPROUVE ? 'active' : ''}
                  onClick={() => setFiltreStatut(StatutModeration.APPROUVE)}
                >
                  Approuvés
                </button>
                <button 
                  className={filtreStatut === StatutModeration.REJETE ? 'active' : ''}
                  onClick={() => setFiltreStatut(StatutModeration.REJETE)}
                >
                  Rejetés
                </button>
              </div>
            </div>
            
            <div className="commentaires-table">
              <div className="table-header">
                <div className="col-auteur">Auteur</div>
                <div className="col-message">Message</div>
                <div className="col-date">Date</div>
                <div className="col-statut">Statut</div>
                <div className="col-actions">Actions</div>
              </div>
              
              {commentairesFiltres.length > 0 ? (
                <div className="table-body">
                  {commentairesFiltres.map((commentaire) => (
                    <div key={commentaire.id} className="table-row">
                      <div className="col-auteur">{commentaire.auteur}</div>
                      <div className="col-message">{commentaire.message}</div>
                      <div className="col-date">{formatDate(commentaire.date)}</div>
                      <div className={`col-statut ${getStatutClass(commentaire.statut)}`}>
                        {getStatutLibelle(commentaire.statut)}
                      </div>
                      <div className="col-actions">
                        {commentaire.statut === StatutModeration.EN_ATTENTE && (
                          <>
                            <button 
                              className="action-button approve"
                              onClick={() => ouvrirModalModeration(commentaire.id, 'approuver')}
                              title="Approuver"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="action-button reject"
                              onClick={() => ouvrirModalModeration(commentaire.id, 'rejeter')}
                              title="Rejeter"
                            >
                              <FaTimes />
                            </button>
                            <button 
                              className="action-button delete"
                              onClick={() => ouvrirModalSuppression(commentaire.id)}
                              title="Supprimer définitivement"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                        {commentaire.statut === StatutModeration.APPROUVE && (
                          <>
                            <button 
                              className="action-button reject"
                              onClick={() => ouvrirModalModeration(commentaire.id, 'rejeter')}
                              title="Rejeter"
                            >
                              <FaTimes />
                            </button>
                            <button 
                              className="action-button delete"
                              onClick={() => ouvrirModalSuppression(commentaire.id)}
                              title="Supprimer définitivement"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                        {commentaire.statut === StatutModeration.REJETE && (
                          <>
                            <button 
                              className="action-button approve"
                              onClick={() => ouvrirModalModeration(commentaire.id, 'approuver')}
                              title="Approuver"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="action-button delete"
                              onClick={() => ouvrirModalSuppression(commentaire.id)}
                              title="Supprimer définitivement"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-comments">
                  <p>Aucun commentaire trouvé avec ce filtre.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Modal de modération */}
      {commentaireAModerer && (
        <div className="moderation-modal">
          <div className="modal-backdrop" onClick={fermerModal}></div>
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>
              {actionModeration === 'approuver' 
                ? 'Approuver ce commentaire' 
                : 'Rejeter ce commentaire'
              }
            </h3>
            
            <p className="modal-message">
              {actionModeration === 'approuver'
                ? 'Êtes-vous sûr de vouloir approuver ce commentaire ? Il sera visible par tous les utilisateurs.'
                : 'Êtes-vous sûr de vouloir rejeter ce commentaire ? Il ne sera pas visible pour les utilisateurs.'
              }
            </p>
            
            {actionModeration === 'rejeter' && (
              <div className="form-group">
                <label htmlFor="raison">Raison du rejet (optionnel)</label>
                <textarea 
                  id="raison"
                  value={raisonRejet}
                  onChange={(e) => setRaisonRejet(e.target.value)}
                  placeholder="Indiquez la raison du rejet..."
                  rows={3}
                />
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={fermerModal}
              >
                Annuler
              </button>
              
              <button 
                className={actionModeration === 'approuver' ? 'confirm-approve' : 'confirm-reject'}
                onClick={effectuerModeration}
              >
                {actionModeration === 'approuver' ? 'Approuver' : 'Rejeter'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de changement de clé */}
      {showChangeKeyModal && (
        <div className="moderation-modal">
          <div className="modal-backdrop" onClick={fermerModalChangementCle}></div>
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Changer la clé d'administration</h3>
            
            <p className="modal-message">
              Modifiez votre clé d'administration. Assurez-vous de la mémoriser ou de la stocker en lieu sûr.
            </p>
            
            <form onSubmit={handleChangerCle}>
              <div className="form-group">
                <label htmlFor="ancienneCle">Clé actuelle</label>
                <input 
                  type="password"
                  id="ancienneCle"
                  value={ancienneCle}
                  onChange={(e) => setAncienneCle(e.target.value)}
                  required
                  placeholder="Entrez votre clé actuelle"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nouvelleCle">Nouvelle clé</label>
                <input 
                  type="password"
                  id="nouvelleCle"
                  value={nouvelleCle}
                  onChange={(e) => setNouvelleCle(e.target.value)}
                  required
                  placeholder="Entrez votre nouvelle clé"
                  minLength={8}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmationCle">Confirmer la nouvelle clé</label>
                <input 
                  type="password"
                  id="confirmationCle"
                  value={confirmationCle}
                  onChange={(e) => setConfirmationCle(e.target.value)}
                  required
                  placeholder="Confirmez votre nouvelle clé"
                />
              </div>
              
              {messageChangementCle.text && (
                <div className={`key-change-message ${messageChangementCle.type}`}>
                  {messageChangementCle.text}
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={fermerModalChangementCle}
                >
                  Annuler
                </button>
                
                <button 
                  type="submit"
                  className="confirm-approve"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="moderation-modal">
          <div className="modal-backdrop" onClick={fermerModalSuppression}></div>
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Supprimer ce commentaire</h3>
            
            <p className="modal-message warning">
              <FaExclamationTriangle className="warning-icon" />
              Attention ! Cette action est irréversible. Le commentaire sera définitivement supprimé de la base de données.
            </p>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={fermerModalSuppression}
              >
                Annuler
              </button>
              
              <button 
                className="confirm-delete"
                onClick={effectuerSuppression}
              >
                Supprimer définitivement
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 