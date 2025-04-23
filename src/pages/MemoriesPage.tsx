import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaRegSmile, FaFilter, FaClock, FaHeart } from 'react-icons/fa';
import MemoryCard from '../components/memories/MemoryCard';
import MemoryForm from '../components/memories/MemoryForm';
import TwitchClipEmbed from '../components/memories/TwitchClipEmbed';
import PageBanner from '../components/common/PageBanner';
import { mockMemories } from '../utils/mockData';
import { Memory } from '../types';
import { memoriesApi } from '../services/api';
import './MemoriesPage.scss';

const MemoriesPage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load memories from API
  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true);
      try {
        const data = await memoriesApi.getAll();
        setMemories(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des souvenirs:', err);
        setError('Impossible de charger les souvenirs. Veuillez réessayer plus tard.');
        
        // Fallback to mockData if API fails
        const approvedMemories = mockMemories.filter(memory => memory.approved);
        setMemories(approvedMemories);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemories();
  }, []);
  
  // Filter and search memories
  const filteredMemories = memories
    .filter(memory => {
      // Filter by search term
      if (searchTerm) {
        return (
          memory.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          memory.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort based on filter
      if (filter === 'recent') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (filter === 'popular') {
        return b.likes - a.likes;
      }
      // Default sorting by recent
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };
  
  const getClipIdFromUrl = (url: string): string | null => {
    if (!url) return null;
    const regex = /(?:clips\.twitch\.tv\/|twitch\.tv\/\w+\/clip\/)([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  const handleMemorySubmit = async (author: string, message: string, clipUrl: string) => {
    // Extract clip ID
    const clipId = getClipIdFromUrl(clipUrl);
    
    try {
      const newMemory = await memoriesApi.add({
        author,
        message,
        clipUrl,
        clipId: clipId || '',
        timestamp: new Date().toISOString()
      });
      
      // Add the new memory to the state at the beginning of the array
      setMemories(prevMemories => [newMemory, ...prevMemories]);
      
      // Show success message
      setSuccessMessage('Votre souvenir a été publié avec succès et est maintenant visible!');
      
      // Scroll to the newly added memory after a brief delay
      setTimeout(() => {
        const memoriesResultsElement = document.querySelector('.memories-results');
        if (memoriesResultsElement) {
          window.scrollTo({
            top: memoriesResultsElement.getBoundingClientRect().top + window.scrollY,
            behavior: 'smooth'
          });
        }
      }, 500);
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un souvenir:', err);
      setSuccessMessage('Une erreur est survenue lors de l\'ajout de votre souvenir. Veuillez réessayer.');
    }
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };
  
  const handleLikeMemory = async (memoryId: string) => {
    try {
      const updatedMemory = await memoriesApi.like(memoryId);
      
      setMemories(prevMemories => 
        prevMemories.map(memory => 
          memory.id === memoryId ? updatedMemory : memory
        )
      );
    } catch (err) {
      console.error('Erreur lors du like d\'un souvenir:', err);
      
      // Optimistic update as fallback
      setMemories(prevMemories => 
        prevMemories.map(memory => 
          memory.id === memoryId 
            ? { ...memory, likes: memory.likes + 1 } 
            : memory
        )
      );
    }
  };
  
  return (
    <div className="memories-page">
      <PageBanner 
        title="Souvenirs du Subathon" 
        subtitle="Partagez et explorez les meilleurs moments du subathon avec des clips Twitch" 
      />
      
      <div className="container memories-container">
        <div className="memories-layout">
          <div className="memories-sidebar">
            <MemoryForm onSubmit={handleMemorySubmit} />
            
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  className={`message-box ${successMessage.includes('erreur') ? 'error-message' : 'success-message'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <FaRegSmile className="message-icon" />
                  <p>{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="memories-main">
            <div className="memories-controls">
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher des souvenirs..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="filter-controls">
                <FaFilter className="filter-icon" />
                <button 
                  className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  Tous
                </button>
                <button 
                  className={`filter-button ${filter === 'recent' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('recent')}
                >
                  <FaClock className="button-icon" /> Plus récents
                </button>
                <button 
                  className={`filter-button ${filter === 'popular' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('popular')}
                >
                  <FaHeart className="button-icon" /> Plus populaires
                </button>
              </div>
            </div>
            
            <div className="memories-count">
              <p>{filteredMemories.length} souvenirs trouvés</p>
            </div>
            
            <div className="memories-results">
              {isLoading ? (
                <div className="loading-spinner">
                  <p>Chargement des souvenirs...</p>
                </div>
              ) : error ? (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              ) : filteredMemories.length > 0 ? (
                filteredMemories.map(memory => (
                  <motion.div 
                    key={memory.id} 
                    className="memory-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {memory.clipId && <TwitchClipEmbed clipId={memory.clipId} />}
                    <MemoryCard 
                      memory={memory} 
                      onClick={() => handleLikeMemory(memory.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="no-memories">
                  <p>Aucun souvenir trouvé. Essayez de modifier votre recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoriesPage; 