import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTwitch, FaDiscord, FaInstagram, FaPaperPlane, FaSmile, FaExclamationTriangle } from 'react-icons/fa';
import PageBanner from '../components/common/PageBanner';
import { formatDate, StatutModeration } from '../utils/commentairesManager';
import { commentsApi } from '../services/api';
import './RemerciementsPage.scss';
import { Commentaire } from '../types';

const RemerciementsPage: React.FC = () => {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [auteur, setAuteur] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [messageEnAttente, setMessageEnAttente] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des commentaires depuis l'API
  useEffect(() => {
    const fetchCommentaires = async () => {
      setIsLoading(true);
      try {
        const data = await commentsApi.getAll();
        // Ne garder que les commentaires approuvés
        const commentairesApprouves = data
          .filter(com => com.statut === StatutModeration.APPROUVE)
          .map(com => ({
            id: com.id,
            auteur: com.auteur,
            message: com.message,
            date: com.date
          }));
        setCommentaires(commentairesApprouves);
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
        // Fallback au localStorage en cas d'erreur
        const savedCommentaires = localStorage.getItem('commentaires');
        if (savedCommentaires) {
          try {
            const parsedCommentaires = JSON.parse(savedCommentaires);
            const commentairesApprouves = parsedCommentaires
              .filter((com: any) => com.statut === StatutModeration.APPROUVE)
              .map((com: any) => ({
                id: com.id,
                auteur: com.auteur,
                message: com.message,
                date: com.date
              }));
            setCommentaires(commentairesApprouves);
          } catch (e) {
            console.error('Erreur lors du parsing des commentaires:', e);
            setCommentaires([]);
          }
        } else {
          setCommentaires([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentaires();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!auteur.trim()) {
      setError('Veuillez entrer votre nom/pseudo');
      return;
    }
    
    if (!message.trim()) {
      setError('Veuillez entrer votre message');
      return;
    }
    
    try {
      // Ajouter le commentaire via l'API
      await commentsApi.add({
        auteur: auteur.trim(),
        message: message.trim()
      });
      
      // Réinitialisation du formulaire
      setAuteur('');
      setMessage('');
      setError(null);
      setMessageEnAttente(true);
      setSuccess('Votre message a été envoyé et sera affiché après validation !');
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (error: any) {
      // Si le message est inapproprié, l'API retournera une erreur
      if (error.message?.includes('inapproprié')) {
        setError('Votre message contient du contenu inapproprié. Veuillez rester respectueux.');
      } else {
        setError('Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.');
        console.error('Erreur lors de l\'ajout du commentaire:', error);
      }
    }
  };

  const contributors = [
    {
      name: 'Ayzoxx',
      role: 'Créateur du site',
      description: 'Conception, design et développement du Memory Book',
      link: 'https://www.instagram.com/nolhan59lec/',
      icon: <FaInstagram />
    },
    {
      name: 'Mawkzy',
      role: 'Streamer',
      description: 'Pour avoir partagé ces moments incroyables avec nous',
      link: 'https://www.twitch.tv/mawkzy_',
      icon: <FaTwitch />
    },
    {
      name: 'La communauté',
      role: 'Soutien',
      description: 'Pour tous les souvenirs partagés et le soutien apporté',
      link: 'https://discord.gg/wkcRDUNumc',
      icon: <FaDiscord />
    }
  ];

  return (
    <div className="remerciements-page">
      <PageBanner 
        title="Remerciements" 
        subtitle="Un grand merci à Mawkzy pour tous ces moments partagés" 
      />
      
      <div className="container main-content">
        <motion.section 
          className="lettre-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Lettre à <span className="highlight">Mawkzy</span></h2>
          <div className="message-card">
            <p className="message-intro">Cher Mawkzy,</p>
            <p>
              Nous voulions prendre un moment pour te remercier sincèrement pour tous les instants de joie, 
              de rire et d'émotion que tu nous as offerts pendant ton subathon. Pendant ces nombreuses heures 
              de stream, tu as créé bien plus qu'un simple divertissement — tu as bâti une véritable communauté.
            </p>
            <p>
              Tes streams ont été une source de réconfort pour beaucoup d'entre nous, un endroit où nous pouvions 
              nous évader après une journée difficile, rire quand nous en avions besoin, et nous sentir connectés 
              même à distance. Ta persévérance, ton authenticité et ta bonne humeur constante ont été une véritable 
              inspiration.
            </p>
            <p>
              Chaque victoire, chaque fou rire, chaque moment de panique et chaque interaction avec le chat ont créé 
              des souvenirs que nous chérirons longtemps. Ce Memory Book n'est qu'une petite façon pour nous de te 
              montrer combien ton dévouement et ton énergie ont compté pour nous.
            </p>
            <p className="message-closing">
              Avec toute notre gratitude,<br />
              Ta communauté
            </p>
            <motion.div 
              className="heart-container"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <FaHeart className="heart-icon" />
            </motion.div>
          </div>
        </motion.section>
        
        <motion.section 
          className="contributors-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Contributeurs Principaux</h2>
          
          <div className="contributors-grid">
            {contributors.map((contributor, index) => (
              <motion.div 
                key={index}
                className="contributor-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: { duration: 0.3 }
                }}
              >
                <div className="contributor-icon">
                  {contributor.icon}
                </div>
                <h3>{contributor.name}</h3>
                <div className="contributor-role">{contributor.role}</div>
                <p>{contributor.description}</p>
                <a 
                  href={contributor.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contributor-link"
                >
                  Visiter
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        <motion.section 
          className="commentaires-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Laissez Votre Message</h2>
          
          <motion.div 
            className="avertissement-respect"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <FaExclamationTriangle className="warning-icon" />
            <p>
              <strong>Attention :</strong> Merci de rester respectueux et bienveillant dans vos messages. Tout commentaire inapproprié, insultant ou négatif envers Mawkzy ou sa communauté entraînera un bannissement immédiat de la plateforme.
            </p>
          </motion.div>

          <motion.div 
            className="moderation-notice"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <p>
              <strong>Note :</strong> Pour garantir une expérience positive pour tous, les messages sont soumis à une modération avant publication. Merci de votre patience.
            </p>
          </motion.div>
          
          <div className="form-container">
            <form className="commentaire-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="auteur">Votre nom <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="auteur" 
                  value={auteur} 
                  onChange={(e) => setAuteur(e.target.value)}
                  placeholder="Entrez votre nom ou pseudo"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Votre message pour Mawkzy <span className="required">*</span></label>
                <textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Partagez votre message de remerciement, vos souvenirs préférés ou tout simplement vos encouragements..."
                  rows={5}
                  required
                />
              </div>
              
              <motion.button 
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPaperPlane className="btn-icon" />
                <span>Publier mon message</span>
              </motion.button>
            </form>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <FaSmile className="success-icon" />
                  <span>{success}</span>
                </motion.div>
              )}

              {messageEnAttente && (
                <motion.div 
                  className="pending-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <p>Votre message sera visible après validation par un modérateur.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="commentaires-list">
            <h3>{commentaires.length > 0 ? 'Messages de la communauté' : 'Soyez le premier à laisser un message!'}</h3>
            
            {isLoading ? (
              <div className="loading-spinner">
                <p>Chargement des messages...</p>
              </div>
            ) : commentaires.length > 0 ? (
              <div className="commentaires-grid">
                {commentaires.map((commentaire) => (
                  <motion.div 
                    key={commentaire.id}
                    className="commentaire-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="commentaire-content">
                      <p className="commentaire-message">"{commentaire.message}"</p>
                      <div className="commentaire-meta">
                        <span className="commentaire-auteur">- {commentaire.auteur}</span>
                        <span className="commentaire-date">{formatDate(commentaire.date)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="no-commentaires">Aucun message n'a encore été publié ou approuvé. Soyez le premier à partager vos pensées!</p>
            )}
          </div>
        </motion.section>
        
        <motion.section 
          className="social-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>Rejoignez-nous</h2>
          
          <div className="social-links">
            <motion.a 
              href="https://www.twitch.tv/mawkzy_" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitch"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTwitch className="social-icon" />
              <span>Twitch</span>
            </motion.a>
            
            <motion.a 
              href="https://discord.gg/wkcRDUNumc" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-link discord"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDiscord className="social-icon" />
              <span>Discord</span>
            </motion.a>
            
            <motion.a 
              href="https://www.instagram.com/mawkzyrl/" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </motion.a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default RemerciementsPage; 