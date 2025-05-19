import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import '../../styles/homeStyles.css';

const HomePage = () => {
  const [activeClub, setActiveClub] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Sample data
  const featuredClubs = [
    {
      name: "Club Robotique",
      description: "Explorez le monde de la robotique et participez à des compétitions internationales.",
      members: 45,
      events: 8,
      category: "Technologie"
    },
    {
      name: "Club Débat",
      description: "Développez vos compétences en communication et participez à des tournois de débat.",
      members: 32,
      events: 12,
      category: "Communication"
    },
    {
      name: "Club Art & Design",
      description: "Exprimez votre créativité à travers diverses formes d'art et de design.",
      members: 28,
      events: 6,
      category: "Art"
    }
  ];

  const features = [
    {
      title: "Gestion Centralisée",
      description: "Tous les clubs EMSI sous un seul système unifié.",
      icon: "🏛️"
    },
    {
      title: "Événements",
      description: "Organisez et gérez facilement les événements de chaque club.",
      icon: "📅"
    },
    {
      title: "Adhésions",
      description: "Simplifiez le processus de demande et d'approbation d'adhésion.",
      icon: "✅"
    }
  ];

  const upcomingEvents = [
    {
      date: "15 Octobre",
      title: "Atelier Robotique",
      club: "Club Robotique",
      description: "Initiation à la programmation de robots avec Arduino."
    },
    {
      date: "20 Octobre",
      title: "Tournoi de Débat",
      club: "Club Débat",
      description: "Thème: 'L'impact des réseaux sociaux sur la société'."
    },
    {
      date: "25 Octobre",
      title: "Exposition d'Art",
      club: "Club Art & Design",
      description: "Présentation des œuvres des membres du club."
    }
  ];

  // Auto-rotate featured clubs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveClub((prev) => (prev + 1) % featuredClubs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll position with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observers
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [clubsRef, clubsInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [eventsRef, eventsInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  // Animation variants
  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 100,
        duration: 0.6
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Improved animated counter
  const AnimatedCounter = ({ value, duration = 1.5 }) => {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    useEffect(() => {
      if (!inView) return;
      
      let start = 0;
      const end = value;
      const incrementTime = (duration * 1000) / end;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }, [inView, value, duration]);

    return <span ref={ref}>{count}</span>;
  };

  // Smooth scroll for anchor links
  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-container">
      {/* Subtle Background Animation */}
      <div className="hero-background">
        {[...Array(6)].map((_, i) => {
          const size = Math.random() * 100 + 100;
          const duration = 20 + Math.random() * 10;
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

      {/* Header with working navigation */}
      <motion.header 
        className="home-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundColor: scrollY > 50 ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
          boxShadow: scrollY > 50 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <div className="header-content">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="logo-icon">🏫</span>
            <span className="logo-text">EMSI Clubs</span>
          </motion.div>
          
          <motion.button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </motion.button>
          
          <AnimatePresence>
            {(isMenuOpen || window.innerWidth > 1024) && (
              <motion.nav 
                className="main-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to="#" 
                  onClick={(e) => handleLinkClick(e, 'clubs')}
                  className="nav-link"
                >
                  Clubs
                </Link>
                <Link 
                  to="#" 
                  onClick={(e) => handleLinkClick(e, 'features')}
                  className="nav-link"
                >
                  Fonctionnalités
                </Link>
                <Link 
                  to="#" 
                  onClick={(e) => handleLinkClick(e, 'events')}
                  className="nav-link"
                >
                  Événements
                </Link>
                <Link 
                  to="#" 
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="nav-link"
                >
                  À propos
                </Link>
                <motion.a 
                  href="/login" 
                  className="nav-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Connexion
                </motion.a>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: heroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="hero-content"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div className="hero-text">
            <motion.h1 variants={fadeInUp}>
              Plateforme de Gestion des Clubs EMSI
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              Centralisez la gestion de tous les clubs, organisez des événements et facilitez les adhésions.
            </motion.p>
            <motion.div className="hero-buttons" variants={fadeInUp}>
              <motion.a 
                href="/register" 
                className="btn btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Créer un compte
              </motion.a>
              <motion.a 
                href="#clubs" 
                className="btn btn-outline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explorer les clubs
              </motion.a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: heroInView ? 1 : 0,
              scale: heroInView ? 1 : 0.9
            }}
            transition={{ 
              delay: 0.3,
              duration: 0.6 
            }}
          >
            <div className="mockup-container">
              <div className="mockup-browser">
                <div className="mockup-browser-bar">
                  <div className="mockup-dot"></div>
                  <div className="mockup-dot"></div>
                  <div className="mockup-dot"></div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-clubs-grid">
                    {[1, 2, 3, 4].map((item) => (
                      <motion.div
                        key={item}
                        className="mockup-club-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + item * 0.1 }}
                      >
                        <div className="mockup-club-image"></div>
                        <div className="mockup-club-name"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="scroll-indicator"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          ↓
        </motion.div>
      </motion.section>

      {/* Clubs Section */}
      <motion.section 
        ref={clubsRef}
        id="clubs" 
        className="clubs-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: clubsInView ? 1 : 0,
          y: clubsInView ? 0 : 50
        }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: clubsInView ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            Clubs à la Une
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: clubsInView ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            Découvrez quelques-uns des clubs actifs de l'EMSI
          </motion.p>
        </div>
        
        <div className="clubs-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClub}
              className="club-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="club-category">{featuredClubs[activeClub].category}</div>
              <h3>{featuredClubs[activeClub].name}</h3>
              <p>{featuredClubs[activeClub].description}</p>
              <div className="club-stats">
                <div className="stat">
                  <span className="stat-value">
                    <AnimatedCounter value={featuredClubs[activeClub].members} />
                  </span>
                  <span className="stat-label">Membres</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    <AnimatedCounter value={featuredClubs[activeClub].events} />
                  </span>
                  <span className="stat-label">Événements</span>
                </div>
              </div>
              <motion.a 
                href="/clubs" 
                className="btn btn-outline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Voir le club
              </motion.a>
            </motion.div>
          </AnimatePresence>
          
          <div className="carousel-controls">
            {featuredClubs.map((_, index) => (
              <motion.button
                key={index}
                className={`carousel-dot ${activeClub === index ? 'active' : ''}`}
                onClick={() => setActiveClub(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        id="features" 
        className="features-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: featuresInView ? 1 : 0,
          y: featuresInView ? 0 : 50
        }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: featuresInView ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            Fonctionnalités Principales
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: featuresInView ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            Tout ce dont vous avez besoin pour gérer les clubs EMSI
          </motion.p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: featuresInView ? 1 : 0,
                y: featuresInView ? 0 : 20
              }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section 
        ref={eventsRef}
        id="events" 
        className="events-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: eventsInView ? 1 : 0,
          y: eventsInView ? 0 : 50
        }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: eventsInView ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            Prochains Événements
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: eventsInView ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            Découvrez les événements à venir dans les clubs EMSI
          </motion.p>
        </div>
        
        <div className="events-timeline">
          <div className="timeline-line"></div>
          
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ 
                opacity: eventsInView ? 1 : 0,
                x: eventsInView ? 0 : (index % 2 === 0 ? -30 : 30)
              }}
              transition={{ delay: 0.3 + index * 0.15 }}
            >
              <motion.div 
                className="event-date"
                whileHover={{ scale: 1.05 }}
              >
                {event.date}
              </motion.div>
              <motion.div 
                className="event-card"
                whileHover={{ y: -3 }}
              >
                <h3>{event.title}</h3>
                <p className="event-club">{event.club}</p>
                <p className="event-description">{event.description}</p>
                <a href="#" className="event-link">Plus d'infos →</a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        ref={ctaRef}
        className="cta-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: ctaInView ? 1 : 0,
          y: ctaInView ? 0 : 50
        }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="cta-card"
          whileHover={{ y: -5 }}
        >
          <h2>Prêt à rejoindre la communauté ?</h2>
          <p>Connectez-vous avec vos clubs préférés et participez aux événements.</p>
          <div className="cta-buttons">
            <motion.a 
              href="/register" 
              className="btn btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              S'inscrire
            </motion.a>
            <motion.a 
              href="/clubs" 
              className="btn btn-outline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Explorer les clubs
            </motion.a>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🏫</span>
            <span className="logo-text">EMSI Clubs</span>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Plateforme</h4>
              <a href="#clubs">Clubs</a>
              <a href="#features">Fonctionnalités</a>
              <a href="#events">Événements</a>
            </div>
            <div className="link-group">
              <h4>EMSI</h4>
              <a href="#about">À propos</a>
              <a href="#contact">Contact</a>
              <a href="#campus">Nos campus</a>
            </div>
            <div className="link-group">
              <h4>Ressources</h4>
              <a href="#help">Aide</a>
              <a href="#faq">FAQ</a>
              <a href="#guide">Guide d'utilisation</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Plateforme des Clubs EMSI. Tous droits réservés.</p>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#instagram">Instagram</a>
            <a href="#linkedin">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;