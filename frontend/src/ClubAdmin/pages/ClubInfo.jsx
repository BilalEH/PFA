import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Edit, Users, Calendar, Award, Shield, Mail, Globe, User, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';
import './ClubInfo.css';

const ClubInfo = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const response = await axios.get(`/api/clubs/${clubId}`);
        setClub(response.data);
      } catch (err) {
        setError('Failed to load club data');
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [clubId]);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="error-container"><div className="error-card">{error}</div></div>;
  if (!club) return <div className="not-found-container">Club not found</div>;

  const foundationDate = club.foundation_date 
    ? new Date(club.foundation_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Date not specified';

  return (
    <div className="club-page">
      {/* Hero Section with Parallax Effect */}
      <div className="hero-parallax">
        <div className="hero-image" style={{ backgroundImage: `url(${club.cover_image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070'})` }}></div>
        <div className="hero-content">
          <div className="hero-overlay">
            <button className="edit-button">
              <Edit size={18} />
              <span>Manage Club</span>
            </button>
          </div>
        </div>
      </div>

      {/* Club Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={club.logo || 'https://via.placeholder.com/150'} 
            alt="Club logo" 
            className="avatar-image"
          />
          <div className="verification-badge">
            <Shield size={16} />
          </div>
        </div>
        
        <div className="profile-info">
          <h1 className="club-title">{club.name}</h1>
          <div className="club-meta">
            <span className="meta-item">
              <MapPin size={16} />
              {club.location || 'Location not specified'}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              Founded {foundationDate}
            </span>
            <span className="meta-item">
              <Users size={16} />
              {club.member_count || '0'} members
            </span>
          </div>
          
          <div className="rating-badge">
            <Star size={16} fill="#FFD700" />
            <span>4.8</span>
            <span className="rating-count">(24 reviews)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="club-tabs">
        <button 
          className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery
        </button>
      </nav>

      {/* Main Content */}
      <div className="club-container">
        {/* Left Column */}
        <main className="main-content">
          {activeTab === 'about' && (
            <>
              <section className="content-card about-section">
                <h2 className="section-title">
                  <Award className="section-icon" />
                  About Our Community
                </h2>
                <p className="section-text">
                  {club.description || 'No description provided. This club focuses on bringing people together around shared interests and activities.'}
                </p>
                
                <div className="highlights-grid">
                  <div className="highlight-card">
                    <div className="highlight-icon"><Users size={24} /></div>
                    <h3>Community</h3>
                    <p>Join {club.member_count || '50'} like-minded individuals</p>
                  </div>
                  <div className="highlight-card">
                    <div className="highlight-icon"><Calendar size={24} /></div>
                    <h3>Regular Events</h3>
                    <p>Weekly meetings and special activities</p>
                  </div>
                  <div className="highlight-card">
                    <div className="highlight-icon"><Award size={24} /></div>
                    <h3>Achievements</h3>
                    <p>Recognized excellence in our field</p>
                  </div>
                </div>
              </section>

              {club.rules && (
                <section className="content-card rules-section">
                  <h2 className="section-title">
                    <Shield className="section-icon" />
                    Community Guidelines
                  </h2>
                  <ol className="rules-list">
                    {club.rules.split('\n').map((rule, index) => (
                      <li key={index}>
                        <ChevronRight size={16} className="rule-icon" />
                        {rule}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </>
          )}

          {activeTab === 'events' && (
            <div className="content-card">
              <h2 className="section-title">Upcoming Events</h2>
              <div className="empty-state">
                <Calendar size={48} className="empty-icon" />
                <p>No upcoming events scheduled</p>
                <button className="primary-button">Create Event</button>
              </div>
            </div>
          )}
        </main>

        {/* Right Column */}
        <aside className="sidebar">
          <div className="sidebar-card status-card">
            <h3 className="sidebar-title">Club Status</h3>
            <div className={`status-indicator ${club.is_active ? 'active' : 'inactive'}`}>
              {club.is_active ? 'Active' : 'Inactive'}
            </div>
            <p className="status-message">
              {club.is_active 
                ? 'This club is currently active and accepting new members' 
                : 'This club is currently inactive'}
            </p>
            <button className="secondary-button small">
              {club.is_active ? 'Join Club' : 'Notify Me'}
            </button>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Leadership</h3>
            <div className="leader-card">
              <div className="leader-avatar">
                <User size={20} />
              </div>
              <div className="leader-info">
                <h4>President</h4>
                <p>{club.president || 'Position vacant'}</p>
              </div>
            </div>
            <div className="leader-card">
              <div className="leader-avatar">
                <User size={20} />
              </div>
              <div className="leader-info">
                <h4>Vice President</h4>
                <p>{club.vice_president || 'Position vacant'}</p>
              </div>
            </div>
          </div>

          <div className="sidebar-card contact-card">
            <h3 className="sidebar-title">Contact Information</h3>
            <div className="contact-item">
              <Mail size={18} className="contact-icon" />
              <a href={`mailto:${club.contact_email}`} className="contact-link">
                {club.contact_email || 'Email not provided'}
              </a>
            </div>
            <div className="contact-item">
              <Globe size={18} className="contact-icon" />
              {club.website ? (
                <a href={club.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                  {club.website.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <span>Website not provided</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ClubInfo;