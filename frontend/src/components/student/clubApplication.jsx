import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Avatar, Divider, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { csrfRequest } from '../../apiConfig/csrfHelper';
import { toast } from 'react-hot-toast';

const ClubApplication = () => {
  const [loading, setLoading] = useState(false);
  const { InterviewId } = useParams();
  const [motivation, setMotivation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic regex validation (at least 10 characters, letters or spaces)
    const motivationRegex = /^[A-Za-zÀ-ÿ0-9\s\.,!?'"()-]{10,}$/;
    if (!motivationRegex.test(motivation)) {
      toast.error('Veuillez entrer une motivation valide (au moins 10 caractères).');
      return;
    }

    setLoading(true);
    try {
      await csrfRequest('post', `/api/interview/application/${InterviewId}`, { motivation });
      toast.success('Candidature envoyée avec succès !');
      setMotivation('');
      navigate('/student/applications');
    } catch (error) {
      if(error.response && error.response.status === 409) {
        toast.error('Vous avez déjà postulé pour cet entretien.');
        return;
      }
      toast.error('Erreur lors de l\'envoi de la candidature.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 1 }}>
              <AssignmentIndIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">
              Formulaire de candidature
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 1 }}>
              Merci de remplir ce formulaire pour postuler au club.
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Votre motivation"
              multiline
              rows={6}
              fullWidth
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              variant="outlined"
              required
              margin="normal"
              InputProps={{ sx: { background: '#f7f7fa', borderRadius: 2 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              endIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
              disabled={loading}
              sx={{
                mt: 2,
                borderRadius: 2,
                fontWeight: 600,
                letterSpacing: 1,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px) scale(1.03)',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
                },
              }}
              component={motion.button}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
            >
              Envoyer la candidature
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ClubApplication;
