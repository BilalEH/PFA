import React, { useEffect, useState } from 'react';
import { Calendar, Users, Briefcase, Bell } from 'lucide-react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { axiosInstance } from '../../apiConfig/axios';
import { Link } from 'react-router-dom';

// StatCard Component - A more modern take on the stat card
function StatCard({ title, value, icon: Icon, color, details }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex-grow">
        {details}
      </div>
    </div>
  );
}

// Placeholder for upcoming events/interviews lists
function InfoBlock({ title, children, link, linkText }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="divide-y divide-gray-200 flex-grow flex items-center justify-center">
                {children}
            </div>
            {link && (
                 <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {/* Replaced Link with a standard anchor tag for compatibility */}
                    <Link to={link} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {linkText}
                    </Link>
                </div>
            )}
        </div>
    );
}

function Dashboard() {
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



 useEffect(() => {
    const fetchClubInfo = async () => {
      setLoading(true);
      try {
        const res=await axiosInstance.get('/api/club-dashboard');
        setClubInfo(res.data.data[0]);
      } catch (e) {
        console.error("Failed to fetch club data:", e);
        setError(e.message);
      } finally {
        setLoading(false)
      }
    };

    fetchClubInfo();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh" sx={{ gap: 2 }}>
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography variant="body1" color="text.secondary">
          Chargement du tableau de bord...
        </Typography>
      </Box>
    );
  }

  if (error) {
     return (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
             <Typography variant="h6" color="error">
                Erreur: {error}
             </Typography>
        </Box>
     )
  }

  const statCards = [
    { title: 'Total des Membres', value: clubInfo.members_count, icon: Users, color: 'bg-blue-500', details: 'Membres actifs dans le club.' },
    { title: 'Événements à Venir', value: clubInfo.upcoming_events_count, icon: Bell, color: 'bg-purple-500', details: `${clubInfo.events_count} événements créés au total.` },
    { title: 'Entretiens en Attente', value: clubInfo.upcoming_interviews_count, icon: Briefcase, color: 'bg-red-500', details: "Demandes d'adhésion à traiter." },
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section with Cover Image and Logo */}
        <div className="relative bg-white rounded-xl shadow-md border-gray-200 p-6 mb-8 overflow-hidden">
            <img src={clubInfo.cover_image} alt="Cover" className="absolute top-0 left-0 w-full h-full object-cover rounded-xl opacity-10"/>
            <div className="relative flex flex-col md:flex-row items-center gap-6">
                <img src={clubInfo.logo} alt="Club Logo" className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex-shrink-0"/>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{clubInfo.name}</h1>
                    <p className="text-gray-600 mt-1 max-w-2xl">{clubInfo.description}</p>
                </div>
            </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Informational Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoBlock 
            title="Prochains Événements"
            link="/club-admin/Events"
            linkText="Voir tous les événements"
          >
            {clubInfo.upcoming_events_count > 0 ? (
                <div className="p-4 text-center text-gray-700">
                    <p className="font-semibold">
                        Vous avez {clubInfo.upcoming_events_count} événement{clubInfo.upcoming_events_count > 1 ? 's' : ''} à venir.
                    </p>
                    <p className="text-xs mt-1 text-gray-500">Cliquez pour les gérer.</p>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">
                    <p>Aucun événement à venir pour le moment.</p>
                    <p className="text-xs mt-1">Les nouveaux événements apparaîtront ici.</p>
                </div>
            )}
          </InfoBlock>
          
          <InfoBlock
            title="Entretiens à Gérer"
            link="/club-admin/interviews"
            linkText="Gérer les entretiens"
           >
             {clubInfo.upcoming_interviews_count > 0 ? (
                <div className="p-4 text-center text-gray-700">
                    <p className="font-semibold">
                        Vous avez {clubInfo.upcoming_interviews_count} entretien{clubInfo.upcoming_interviews_count > 1 ? 's' : ''} en attente.
                    </p>
                     <p className="text-xs mt-1 text-gray-500">Cliquez pour les accepter ou refuser.</p>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">
                    <p>Aucun entretien en attente.</p>
                    <p className="text-xs mt-1">La boîte de réception est vide !</p>
                </div>
            )}
           </InfoBlock>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;