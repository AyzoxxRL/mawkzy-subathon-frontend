import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaTwitch, FaLink } from 'react-icons/fa';
import './MemoryForm.scss';

interface MemoryFormProps {
  onSubmit: (author: string, message: string, clipUrl: string) => void;
}

const MemoryForm: React.FC<MemoryFormProps> = ({ onSubmit }) => {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [clipUrl, setClipUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  
  const MAX_CHAR_COUNT = 500;
  
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
    setError(null);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    
    if (newMessage.length <= MAX_CHAR_COUNT) {
      setMessage(newMessage);
      setCharCount(newMessage.length);
      setError(null);
    }
  };
  
  const handleClipUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClipUrl(e.target.value);
    setError(null);
  };
  
  const validateTwitchClipUrl = (url: string): boolean => {
    // Vérifier si l'URL est un lien Twitch clip valide
    const twitchClipRegex = /^(https?:\/\/)?(www\.)?(clips\.twitch\.tv\/|twitch\.tv\/\w+\/clip\/)[\w-]+$/i;
    
    // Vérifier d'abord si c'est un format de clip Twitch valide
    if (!twitchClipRegex.test(url)) {
      return false;
    }
    
    // Vérifier ensuite si le clip appartient à Mawkzy
    const lowerCaseUrl = url.toLowerCase();
    return lowerCaseUrl.includes('mawkzy') || 
           lowerCaseUrl.includes('twitch.tv/mawkzy_') || 
           lowerCaseUrl.includes('twitch.tv/mawkzy_/clip');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs
    if (!author.trim()) {
      setError('Veuillez entrer votre nom/pseudo');
      return;
    }
    
    if (!message.trim()) {
      setError('Veuillez entrer votre commentaire');
      return;
    }
    
    if (!clipUrl.trim()) {
      setError('Veuillez entrer le lien du clip Twitch');
      return;
    }
    
    if (!validateTwitchClipUrl(clipUrl)) {
      setError('Veuillez entrer un lien de clip Twitch valide de Mawkzy');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(author, message, clipUrl);
      setAuthor('');
      setMessage('');
      setClipUrl('');
      setCharCount(0);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <motion.div 
      className="memory-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Ajoutez votre souvenir</h2>
      <p className="form-description">
        Partagez votre moment préféré du subathon de Mawkzy avec un clip et un commentaire
      </p>
      
      {error && (
        <motion.div 
          className="form-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      
      <form className="memory-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="author">Votre nom/pseudo <span className="required">*</span></label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={handleAuthorChange}
            placeholder="Entrez votre nom ou pseudo"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group clip-url-group">
          <label htmlFor="clipUrl">
            <FaTwitch className="twitch-icon" /> Lien du clip Twitch <span className="required">*</span>
          </label>
          <div className="clip-input-wrapper">
            <FaLink className="link-icon" />
            <input
              type="url"
              id="clipUrl"
              value={clipUrl}
              onChange={handleClipUrlChange}
              placeholder="https://clips.twitch.tv/..."
              disabled={isSubmitting}
              required
            />
          </div>
          <small className="clip-helper">
            Ajoutez un lien vers un clip Twitch de la chaîne Mawkzy (obligatoire)
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Votre commentaire <span className="required">*</span></label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Décrivez pourquoi ce moment est mémorable..."
            rows={5}
            disabled={isSubmitting}
            required
          />
          <div className="char-count">
            <span className={charCount > MAX_CHAR_COUNT * 0.8 ? 'warning' : ''}>
              {charCount}/{MAX_CHAR_COUNT} caractères
            </span>
          </div>
        </div>
        
        <motion.button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? (
            <span>Envoi en cours...</span>
          ) : (
            <>
              <FaPaperPlane className="submit-icon" />
              <span>Publier le souvenir</span>
            </>
          )}
        </motion.button>
      </form>
      
      <p className="form-note">
        Note: Les souvenirs sont soumis à modération avant d'être publiés. Tous les champs sont obligatoires.
      </p>
    </motion.div>
  );
};

export default MemoryForm; 