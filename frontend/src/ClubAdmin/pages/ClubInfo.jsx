import React, { useEffect, useState } from 'react';
import { Edit, BookOpen, Info, X, UploadCloud, AlertCircle } from 'lucide-react';
// Assuming axiosInstance is configured elsewhere. For this demo, we'll use mock data.
// import { axiosInstance } from '../../apiConfig/axios'; 
import {
  Box, Typography, CircularProgress, Avatar, Button, Stack, Divider, Chip,
  Modal, TextField, IconButton, Card, CardContent, LinearProgress, Backdrop
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../apiConfig/axios';

// Modal Style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 600 },
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

// Main Component
export default function ClubInfo({ clubId = 1 }) {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  // State for form inputs
  const [editableData, setEditableData] = useState({ description: '', rules: '' });
  // State for image upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`api/club-info`);
        setClub(response.data.data[0]);
      } catch (error) {
        console.error('Failed to fetch club:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Simulate network delay
      }
    };
    fetchClub();
  }, [clubId]);

  const handleOpenEditModal = () => {
      if (!club) return;
      // Initialize states for the modal
      setEditableData({ description: club.description, rules: club.rules || '' });
      setPreviewUrl(club.cover_image);
      setSelectedFile(null);
      setUploadError(null);
      setEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => setEditModalOpen(false);
  
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditableData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          setUploadError(null);
      }
  };

  const handleSaveChanges = async () => {
      setIsUploading(true);
      setUploadError(null);

      // --- IMPORTANT: Paste your imgbb API key here ---
      const IMGBB_API_KEY = "8832153b5e9b73e6daaa432dd081e2e9"; 

      let finalCoverImageUrl = club.cover_image;

      // Step 1: Upload image to imgbb if a new one is selected
      if (selectedFile) {
          if (!IMGBB_API_KEY || IMGBB_API_KEY === "YOUR_IMGBB_API_KEY_HERE") {
              setUploadError("ImgBB API Key is not configured.");
              setIsUploading(false);
              return;
          }
          const formData = new FormData();
          formData.append('image', selectedFile);
          
          try {
              const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                  method: 'POST',
                  body: formData,
              });
              const result = await response.json();
              if (result.success) {
                  finalCoverImageUrl = result.data.url;
              } else {
                  throw new Error(result.error?.message || "Failed to upload image.");
              }
          } catch (error) {
              setUploadError(error.message);
              setIsUploading(false);
              return;
          }
      }

      // Step 2: Prepare final data and "save" it
      const finalDataToSave = {
          ...editableData,
          cover_image: finalCoverImageUrl,
      };

      console.log("Saving data:", finalDataToSave);
      // --- Here you would make your real API call to your backend ---
      // await axiosInstance.put(`/api/clubs/${club.id}`, finalDataToSave);
      
      // For demonstration, we just update the local state
      setClub(prev => ({ ...prev, ...finalDataToSave }));
      
      setIsUploading(false);
      handleCloseEditModal();
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh" gap={2}>
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography>Chargement des informations du club...</Typography>
      </Box>
    );
  }

  if (!club) return <Typography>Club not found.</Typography>;

  return (
    <Box className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header with Cover Image */}
        <Box
          sx={{
            height: { xs: 200, sm: 250, md: 300 },
            borderRadius: 4,
            boxShadow: 'lg',
            backgroundImage: `url(${club.cover_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            p: 3,
          }}
        >
          <Box className="absolute top-4 right-4">
              <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Edit />}
                  onClick={handleOpenEditModal}
                  sx={{ textTransform: 'none', borderRadius: '99px', boxShadow: 'lg' }}
                >
                  Edit Club
              </Button>
          </Box>
        </Box>

        {/* Club Info Header */}
        <Box className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center gap-4 -mt-16 mx-4 sm:mx-8 relative z-10">
            <Avatar
              src={club.logo}
              alt="Club Logo"
              sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, border: '4px solid white', boxShadow: 3 }}
            />
            <div className="text-center sm:text-left">
              <Typography variant="h4" fontWeight="bold">{club.name}</Typography>
              <Chip
                  label={club.is_active ? 'Active' : 'Inactive'}
                  color={club.is_active ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 'bold', mt: 1 }}
                />
            </div>
        </Box>

        {/* Main Content */}
        <Box className="mt-6 space-y-6">
            <Card elevation={0} className="border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}><Info className="text-blue-500"/><Typography variant="h6" fontWeight="bold">About the Club</Typography></Stack>
                    <Typography color="text.secondary" className="whitespace-pre-wrap">{club.description}</Typography>
                </CardContent>
            </Card>
            <Card elevation={0} className="border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}><BookOpen className="text-green-500"/><Typography variant="h6" fontWeight="bold">Club Rules</Typography></Stack>
                    <Typography color="text.secondary" className="whitespace-pre-wrap">{club.rules || <em>No rules defined. Click 'Edit Club' to add them.</em>}</Typography>
                </CardContent>
            </Card>
        </Box>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            {/* Animated Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                zIndex: 1300,
                inset: 0,
                background: 'rgba(0,0,0,0.25)',
              }}
              onClick={handleCloseEditModal}
            />
            {/* Animated Modal Content */}
            <Modal open={true} onClose={handleCloseEditModal} closeAfterTransition sx={{ zIndex: 1400 }}>
              <motion.div
                key="modal"
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ outline: 'none' }}
              >
                <Box sx={modalStyle}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h2">Edit Club Information</Typography>
                    <IconButton onClick={handleCloseEditModal} disabled={isUploading}><X/></IconButton>
                  </Stack>
                  <Stack spacing={3}>
                    <Typography variant="subtitle1" fontWeight="medium">Cover Image</Typography>
                    <Box sx={{ width: '100%', height: 150, borderRadius: 2, border: '2px dashed #e0e0e0', backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', mb: 1 }}/>
                    <Button variant="outlined" component="label" startIcon={<UploadCloud/>} disabled={isUploading}>
                      Upload New Image
                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                    <TextField name="description" label="About the Club" value={editableData.description} onChange={handleInputChange} multiline rows={6} fullWidth variant="outlined" disabled={isUploading} />
                    <TextField name="rules" label="Club Rules" value={editableData.rules} onChange={handleInputChange} multiline rows={4} fullWidth variant="outlined" helperText="You can write each rule on a new line." disabled={isUploading} />
                    {isUploading && <LinearProgress color="primary" />}
                    {uploadError && (
                      <Chip icon={<AlertCircle size={16}/>} label={uploadError} color="error" size="small" sx={{p:2}}/>
                    )}
                  </Stack>
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="text" onClick={handleCloseEditModal} disabled={isUploading}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveChanges} disabled={isUploading}>
                      {isUploading ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Modal>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}
