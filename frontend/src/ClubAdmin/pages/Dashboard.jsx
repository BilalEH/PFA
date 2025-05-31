import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Bell } from 'lucide-react';
import { CircularProgress, Box, Typography } from '@mui/material';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 h-full">
      <div className="flex items-center h-full">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function UpcomingEvent({ title, date, participants }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex items-center">
        <Users className="h-4 w-4 text-gray-400 mr-1" />
        <span className="text-sm text-gray-600">{participants}</span>
      </div>
    </div>
  );
}

function PendingInterview({ student, date, time }) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{student}</h3>
        <p className="text-sm text-gray-500">
          {date} à {time}
        </p>
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
          Accepter
        </button>
        <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
          Refuser
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState({ name: 'Club Générique' });

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats({
        members: 42,
        pendingInterviews: 3,
        upcomingEvents: 2,
      });
      setEvents([
        { id: 1, title: 'Hackathon Étudiant', start_date: new Date(), participants: 25 },
        { id: 2, title: 'Réunion mensuelle', start_date: new Date(), participants: 10 },
      ]);
      setInterviews([
        { id: 1, student_name: 'Adam Elhadi', scheduled_at: new Date() },
        { id: 2, student_name: 'Lina Elhadi', scheduled_at: new Date() },
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh" sx={{ gap: 2 }}>
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography variant="body1" color="text.secondary">
          Chargement des informations du club...
        </Typography>
      </Box>
    );
  }

  const statCards = [
    { title: 'Membres', value: stats.members, icon: Users, color: 'bg-blue-500' },
    { title: 'Entretiens en attente', value: stats.pendingInterviews, icon: Calendar, color: 'bg-orange-500' },
    { title: 'Événements à venir', value: stats.upcomingEvents, icon: Bell, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Bienvenue sur {club.name}</h2>
        <p className="text-gray-600">Résumé des activités de votre club</p>
      </div>

      {/* Statistiques - Cartes modernisées et centrées */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl w-full">
          {statCards.map((stat) => (
            <div key={stat.title} className="flex-1 min-w-[260px] max-w-[320px]">
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blocs Événements & Entretiens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Événements à venir</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <UpcomingEvent
                key={event.id}
                title={event.title}
                date={new Date(event.start_date).toLocaleDateString('fr-FR')}
                participants={event.participants}
              />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link to="/club-admin/Events" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Voir tous les événements →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Entretiens en attente</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {interviews.map((interview) => (
              <PendingInterview
                key={interview.id}
                student={interview.student_name}
                date={new Date(interview.scheduled_at).toLocaleDateString('fr-FR')}
                time={new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link to="/club-admin/interviews" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Gérer les entretiens →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
