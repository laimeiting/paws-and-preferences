import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Card = ({ cat, onSwipe, isTop }) => {
  const [exitX, setExitX] = useState(0);

  // Motion values for gesture physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]); // Rotate 25deg when dragged
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Background color change based on swipe direction (subtle visual cue)
  const overlayOpacity = useTransform(x, [-150, 0, 150], [0.5, 0, 0.5]);
  const overlayColor = useTransform(x, [-150, 0, 150], ["#e74c3c", "transparent", "#2ecc71"]);

  const handleDragEnd = (event, info) => {
    const threshold = 100; // Drag distance required to trigger swipe
    if (info.offset.x > threshold) {
      setExitX(200);
      onSwipe("left");  // Drag left = pass ✕
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      onSwipe("right");  // Drag right = like ❤️
    }
  };

  return (
    <motion.div
      className="card"
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 1 }}
      drag={isTop ? "x" : false} // Only top card is draggable
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 0 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }} // Stack effect
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Image with preloader logic handled by browser */}
      <img 
        src={cat.imageUrl} 
        alt="Cat" 
        draggable="false" 
      />

      {/* Color Overlay for Swipe Feedback */}
      <motion.div 
        className="swipe-feedback" 
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} 
      />

      <div className="card-info">
        {cat.tags && cat.tags.length > 0 && (
            <span className="tag">#{cat.tags[0]}</span>
        )}
      </div>
    </motion.div>
  );
};

export default Card;