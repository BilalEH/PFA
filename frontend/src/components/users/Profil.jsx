import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, TextField, Typography, Button, Grid, Box, Alert, CircularProgress, Avatar, Paper,
  IconButton, useTheme, useMediaQuery, Chip, Divider, InputAdornment, styled, alpha,
  Stack
} from '@mui/material';
import {
  Edit, Save, X, Mail, Phone, Hash, Briefcase, GraduationCap, User
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { axiosInstance } from '../../apiConfig/axios';
import { csrfRequest } from '../../apiConfig/csrfHelper';
import axios from 'axios'; // Importation d'axios pour l'appel à ImgBB
import toast from 'react-hot-toast';

// =================================================================
// ====> METTEZ VOTRE CLÉ API IMGBB ICI <====
// =================================================================
const IMGBB_API_KEY = '8832153b5e9b73e6daaa432dd081e2e9'; 
// =================================================================


// --- Styled Components & Helpers ---
const ProfileWrapper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 4,
  overflow: 'hidden',
  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
  background: theme.palette.background.paper,
}));

const ProfileBanner = styled(Box)(({ theme }) => ({
  height: '200px',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(0, 3, 3),
  marginTop: '-75px',
  position: 'relative',
}));

const InfoSection = styled(motion.div)(({ theme }) => ({
    padding: theme.spacing(3, 4),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const springTransition = { type: "spring", stiffness: 300, damping: 30 };

// --- Main Component ---
const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- State ---
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // --- Data Fetching ---
  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/profile');
      const user = response.data.user;
      const fetchedData = {
        first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '',
        phone_number: user.phone_number || '', bio: user.bio || '', profile_image: null,
        profile_image_url: user.profile_image || '', student_id: user.student_id || '',
        major: user.major || '', year_of_study: user.year_of_study || '', user_type: user.user_type || '',
      };
      setFormData(fetchedData);
      setInitialData(fetchedData);
      setImagePreview(fetchedData.profile_image_url);
    } catch (err) {
      setError('Impossible de charger les données du profil.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);
  
  // --- Handlers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData(initialData);
    setImagePreview(initialData.profile_image_url);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setMessage('');
    
    if (IMGBB_API_KEY == '') {
        toast.error("Veuillez configurer votre clé API ImgBB dans le code.");
        setUpdating(false);
        return;
    }

    let imageUrl = null;

    // --- ÉTAPE 1: UPLOAD DE L'IMAGE SUR IMGBB (si une nouvelle image est sélectionnée) ---
    if (formData.profile_image) {
      const toastId = toast.loading('Téléversement de l\'image...');
      try {
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', formData.profile_image);
        
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, imgbbFormData);
        
        imageUrl = res.data.data.url;
        toast.success('Image téléversée !', { id: toastId });

      } catch (uploadError) {
        toast.error("Erreur lors du téléversement de l'image.", { id: toastId });
        setError("Le téléversement de l'image a échoué. Veuillez réessayer.");
        setUpdating(false);
        return;
      }
    }

    // --- ÉTAPE 2: PRÉPARATION DES DONNÉES POUR VOTRE BACKEND ---
    const payload = {};
    let hasChanges = false;
    
    // Ajouter les champs texte modifiés
    Object.keys(formData).forEach(key => {
        if (!['profile_image', 'profile_image_url', 'user_type'].includes(key)) {
            if(formData[key] !== initialData[key]) {
                payload[key] = formData[key] || '';
                hasChanges = true;
            }
        }
    });

    // Ajouter la nouvelle URL de l'image si elle existe
    if (imageUrl) {
        payload.profile_image = imageUrl;
        hasChanges = true;
    }

    if (!hasChanges) {
        setMessage("Aucun changement à enregistrer.");
        setEditMode(false);
        setUpdating(false);
        return;
    }

    // --- ÉTAPE 3: ENVOI DES DONNÉES (URL + TEXTE) À VOTRE BACKEND ---
    try {
      await csrfRequest('PATCH', '/api/profile', payload); // Envoi en JSON
      setMessage('Profil mis à jour avec succès !');
      await fetchProfile(); // Recharger les données pour être à jour
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'La mise à jour a échoué.');
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ py: {xs: 2, sm: 4} }}>
      <AnimatePresence>
        {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert></motion.div>}
        {message && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert></motion.div>}
      </AnimatePresence>

      <LayoutGroup>
        <ProfileWrapper component={motion.div} layout transition={springTransition}>
          <ProfileBanner />
          <ProfileHeader>
            <motion.div layout transition={springTransition} style={{ position: 'relative' }}>
                <Avatar src={imagePreview} sx={{ width: 150, height: 150, border: `6px solid ${theme.palette.background.paper}` }} />
                {editMode && (
                    <IconButton component="label" sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: alpha(theme.palette.background.paper, 0.8), '&:hover': { bgcolor: theme.palette.background.paper }}}>
                        <Edit size={18} color={theme.palette.primary.main} />
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </IconButton>
                )}
            </motion.div>
            <motion.div layout="position" transition={springTransition}>
              <Typography variant="h4" fontWeight={700} mt={2}>{formData.first_name} {formData.last_name}</Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>{formData.major || 'Étudiant'}</Typography>
            </motion.div>
          </ProfileHeader>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, pt: 0 }}>
            <AnimatePresence mode="wait">
                {editMode ? (
                    <motion.div key="save-cancel" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                        <Stack direction="row" spacing={1}>
                            <Button onClick={handleCancelEdit} variant="text" color="inherit" startIcon={<X size={16}/>}>Annuler</Button>
                            <Button onClick={handleSubmit} variant="contained" disabled={updating} startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <Save size={16}/>}>
                                {updating ? 'Sauvegarde...' : 'Enregistrer'}
                            </Button>
                        </Stack>
                    </motion.div>
                ) : (
                    <motion.div key="edit-btn" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                        <Button variant="contained" startIcon={<Edit size={16}/>} onClick={() => setEditMode(true)}>Modifier le Profil</Button>
                    </motion.div>
                )}
            </AnimatePresence>
          </Box>
          
          <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div key="edit-content">
              <InfoSection><Typography variant="h6" fontWeight={600}>Informations Personnelles</Typography><Grid container spacing={2} mt={1}><Grid item xs={12} sm={6}><TextField fullWidth label="Prénom" name="first_name" value={formData.first_name} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} /></InputAdornment> }}/></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Nom" name="last_name" value={formData.last_name} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} /></InputAdornment> }}/></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment> }}/></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Téléphone" name="phone_number" value={formData.phone_number} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={18} /></InputAdornment> }}/></Grid></Grid></InfoSection>
              <InfoSection><Typography variant="h6" fontWeight={600}>Informations Académiques</Typography><Grid container spacing={2} mt={1}><Grid item xs={12} sm={6}><TextField fullWidth label="ID Étudiant" name="student_id" value={formData.student_id} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Hash size={18} /></InputAdornment> }}/></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Filière" name="major" value={formData.major} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><Briefcase size={18} /></InputAdornment> }}/></Grid><Grid item xs={12} sm={6}><TextField fullWidth label="Année d'étude" name="year_of_study" type="number" value={formData.year_of_study} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><GraduationCap size={18} /></InputAdornment> }}/></Grid></Grid></InfoSection>
              <InfoSection><Typography variant="h6" fontWeight={600}>Biographie</Typography><TextField fullWidth label="À propos de moi" name="bio" multiline rows={4} value={formData.bio} onChange={handleChange} variant="outlined" sx={{mt:2}}/></InfoSection>
            </motion.div>
          ) : (
            <motion.div key="view-content">
                <InfoSection><Typography variant="h6" fontWeight={600} gutterBottom>À Propos de Moi</Typography><Typography color="text.secondary" sx={{whiteSpace: 'pre-wrap'}}>{formData.bio || <Box component="em">Aucune biographie fournie.</Box>}</Typography></InfoSection>
                <InfoSection>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Contact & Infos</Typography>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} md={6}><InfoItem icon={<Mail size={20} />} label="Email" value={formData.email} /></Grid>
                        <Grid item xs={12} md={6}><InfoItem icon={<Phone size={20} />} label="Téléphone" value={formData.phone_number} /></Grid>
                        <Grid item xs={12} md={6}><InfoItem icon={<Hash size={20} />} label="ID Étudiant" value={formData.student_id} /></Grid>
                        <Grid item xs={12} md={6}><InfoItem icon={<Briefcase size={20} />} label="Filière" value={formData.major} /></Grid>
                        <Grid item xs={12} md={6}><InfoItem icon={<GraduationCap size={20} />} label="Année d'étude" value={formData.year_of_study} /></Grid>
                    </Grid>
                </InfoSection>
            </motion.div>
          )}
          </AnimatePresence>
        </ProfileWrapper>
      </LayoutGroup>
    </Container>
  );
};

// Helper component
const InfoItem = ({ icon, label, value }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
            <Box color="primary.main">{icon}</Box>
            <Box>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="body1" fontWeight={500} sx={{wordBreak: 'break-word'}}>{value || <Box component="em" sx={{color: 'text.disabled'}}>Non fourni</Box>}</Typography>
            </Box>
        </Stack>
    </motion.div>
);

export default Profile;