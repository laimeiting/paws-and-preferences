import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { Heart, X, RotateCcw, Cat } from "lucide-react";
import Card from "./Card";
import "./App.css";

const App = () => {
  const [cats, setCats] = useState([]);
  const [likedCats, setLikedCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1); // Points to the visible card
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("swipe"); // 'swipe' or 'summary'

  // Fetch Cats on mount
  useEffect(() => {
    fetchCats();
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view !== "swipe" || currentIndex < 0) return;
      if (e.key === "ArrowRight") handleSwipe("right", cats[currentIndex]);
      if (e.key === "ArrowLeft") handleSwipe("left", cats[currentIndex]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, view, cats]);

  const fetchCats = async () => {
    setLoading(true);
    try {
      // Fetch 15 cute cats
      const response = await axios.get("https://cataas.com/api/cats?tags=cute&limit=15");
      
      // Process data to ensure stable IDs and URLs
      const cleanCats = response.data
        .filter(cat => cat._id || cat.id) // Ensure ID exists
        .map(cat => ({
          _id: cat._id || cat.id,
          tags: cat.tags || [],
          // Pre-compute URL
          imageUrl: `https://cataas.com/cat/${cat._id || cat.id}`
        }));

      setCats(cleanCats);
      setCurrentIndex(cleanCats.length - 1); // Start from end of array (top of stack)
    } catch (error) {
      console.error("API Error:", error);
      // Fallback if API fails completely
      alert("Oops! The cat server is sleepy. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction, cat) => {
    if (direction === "right") {
      setLikedCats((prev) => [...prev, cat]);
    }

    // Move index down
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    // If no more cards, go to summary
    if (newIndex < 0) {
      setTimeout(() => setView("summary"), 400);
    }
  };

  const restartApp = () => {
    setLikedCats([]);
    setLoading(true);
    setView("swipe");
    fetchCats(); // Fetch fresh cats
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Cat size={48} className="bounce" />
        <p>Herding cats...</p>
      </div>
    );
  }

  // --- SUMMARY VIEW ---
  if (view === "summary") {
    return (
      <div className="summary-container">
        <header>
          <h1>Purrfect Matches!</h1>
          <p>You liked {likedCats.length} cats.</p>
        </header>
        
        <div className="grid">
          {likedCats.length > 0 ? (
            likedCats.map((cat) => (
              <div key={cat._id} className="grid-item">
                <img src={cat.imageUrl} alt="Liked Cat" loading="lazy" />
              </div>
            ))
          ) : (
            <div className="no-matches">
              <p>No matches? You must be a dog person. 🐶</p>
            </div>
          )}
        </div>

        <button className="restart-btn" onClick={restartApp}>
          <RotateCcw size={20} /> Start Over
        </button>
      </div>
    );
  }

  // --- SWIPE VIEW ---
  return (
    <div className="app-container">
      <div className="header">
        <Cat size={28} color="var(--primary)" />
        <h2>Paws & Preferences</h2>
      </div>

      <div className="card-stack">
        <AnimatePresence>
          {cats.map((cat, index) => (
            // Only render the top 2 cards for performance
            (index === currentIndex || index === currentIndex - 1) && (
              <Card
                key={cat._id}
                cat={cat}
                isTop={index === currentIndex}
                onSwipe={(dir) => handleSwipe(dir, cat)}
              />
            )
          ))}
        </AnimatePresence>
        
        {currentIndex < 0 && <div className="empty-msg">No more cats!</div>}
      </div>

      <div className="controls">
        <button 
          onClick={() => handleSwipe("left", cats[currentIndex])} 
          disabled={currentIndex < 0}
          className="btn dislike"
          aria-label="Pass"
        >
          <X size={32} />
        </button>
        <button 
          onClick={() => handleSwipe("right", cats[currentIndex])} 
          disabled={currentIndex < 0}
          className="btn like"
          aria-label="Like"
        >
          <Heart size={32} fill="currentColor" />
        </button>
      </div>
      
      <p className="hint">Swipe Left to Pass ✕ • Right to Like ❤️</p>
    </div>
  );
};

export default App;