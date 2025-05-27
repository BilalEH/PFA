import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles'; // Added alpha import
import { Box, Typography } from '@mui/material';

const LoadingScreen = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Dynamic colors based on theme
  const primaryColor = theme.palette.primary.main;
  const bgColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  
  // Motion values for interactive animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth - 0.5);
    mouseY.set(e.clientY / window.innerHeight - 0.5);
  };
  
  // Parallax effects
  const x1 = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const y1 = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);
  const x2 = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const y2 = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

  return (
    <Box 
      onMouseMove={handleMouseMove}
      sx={{
        // position: 'fixed',
        // top: 0,
        // left: 0,
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Animated particles background */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const duration = 10 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={`particle-${i}`}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0, 0.5, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: primaryColor,
              filter: 'blur(1px)',
              opacity: 0.3
            }}
          />
        );
      })}
      
      {/* Floating blobs with parallax effect */}
      <motion.div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: alpha(primaryColor, 0.05),
          filter: 'blur(60px)',
          x: x1,
          y: y1
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: alpha(primaryColor, 0.08),
          filter: 'blur(40px)',
          x: x2,
          y: y2
        }}
      />
      
      {/* Main loading content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
          textAlign: 'center'
        }}
      >
        {/* Animated logo/icon */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            },
            scale: {
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              repeatType: "reverse"
            }
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            backgroundColor: alpha(primaryColor, 0.1),
            border: `2px solid ${alpha(primaryColor, 0.3)}`
          }}
        >
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 0.9, 1]
            }}
            transition={{
              rotate: {
                repeat: Infinity,
                duration: 2,
                ease: "linear"
              },
              scale: {
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                repeatType: "reverse"
              }
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: alpha(primaryColor, 0.2),
              border: `2px solid ${alpha(primaryColor, 0.5)}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear"
                },
                scale: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: primaryColor,
                boxShadow: `0 0 20px ${alpha(primaryColor, 0.5)}`
              }}
            />
          </motion.div>
        </motion.div>
        
        {/* Loading text with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: textColor,
              mb: 1
            }}
          >
            Chargement en cours
          </Typography>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              height: 4,
              backgroundColor: alpha(primaryColor, 0.3),
              borderRadius: 2,
              margin: '0 auto'
            }}
          >
            <motion.div
              animate={{
                x: [0, 180, 0],
                width: [20, 20, 20]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                height: '100%',
                backgroundColor: primaryColor,
                borderRadius: 2,
                boxShadow: `0 0 10px ${primaryColor}`
              }}
            />
          </motion.div>
        </motion.div>
        
        {/* Subtle animated dots */}
        <motion.div
          style={{
            display: 'flex',
            marginTop: 24,
            gap: 8
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: primaryColor,
                opacity: 0.6
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;