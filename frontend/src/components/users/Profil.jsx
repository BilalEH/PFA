import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { axiosInstance } from '../../apiConfig/axios';
import '../../styles/authStyles.css';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    bio: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile data...');
        const response = await axiosInstance.get('/api/profile');
        console.log('Profile response:', response.data);
        const user = response.data.user;
        setFormData({
          phoneNumber: user.phone_number || '',
          bio: user.bio || '',
          profileImage: null,
        });
      } catch (err) {
        console.error('Fetch profile error:', err.response?.status, err.response?.data || err.message);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      await axiosInstance.get('/sanctum/csrf-cookie');
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const formDataToSend = new FormData();
      formDataToSend.append('phone_number', formData.phoneNumber);
      formDataToSend.append('bio', formData.bio);
      if (formData.profileImage) {
        formDataToSend.append('profile_image', formData.profileImage);
      }

      // Log FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      const response = await axiosInstance.patch('/api/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        },
      });

      console.log('Profile update response:', response.data);
      setMessage('Profile updated successfully!');

      // Refresh form data with updated user data
      const updatedUser = response.data.user;
      setFormData({
        phoneNumber: updatedUser.phone_number || '',
        bio: updatedUser.bio || '',
        profileImage: null,
      });
    } catch (err) {
      console.error('Profile update error:', err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-form-container">
          <h2>Update Your Profile</h2>
          <p className="subtitle">Add or update your personal information</p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="status-message">{message}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+212123456789"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="5"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;