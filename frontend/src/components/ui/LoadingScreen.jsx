// src/components/LoadingScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/homeStyles.css'; // reuses same styling base

const LoadingScreen = () => {
  return (
    <div className="home-container" style={{ minHeight: '100vh', backgroundColor: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      {/* Animated Blobs Background */}
      <div className="hero-background">
        {[...Array(5)].map((_, i) => {
          const size = Math.random() * 80 + 80;
          const duration = 15 + Math.random() * 10;
          const delay = Math.random() * 5;
          return (
            <motion.div
              key={i}
              className="bg-shape"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                rotate: Math.random() * 360
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                rotate: 360
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: `rgba(12, 157, 119, ${Math.random() * 0.1 + 0.05})`,
                filter: 'blur(40px)',
                position: 'absolute'
              }}
            />
          );
        })}
      </div>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="loading-content"
        style={{ textAlign: 'center', zIndex: 2 }}
      >
        <motion.div
          className="loader-circle"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '6px solid var(--primary-color)',
            borderTop: '6px solid transparent',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        />
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ marginTop: 20, color: 'var(--text-dark)', fontWeight: 600 }}
        >
          Chargement...
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
