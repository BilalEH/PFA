import React, { useEffect, useState } from 'react';
// import { useAuth } from './AuthContext';
import { Calendar, Users, Bell, Activity } from 'lucide-react';
import axios from 'axios';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
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
  const { club } = useAuth();
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/dashboard/${club.id}`);
        setStats(response.data.stats);
        setEvents(response.data.events);
        setInterviews(response.data.interviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (club?.id) fetchData();
  }, [club]);

  if (loading) return <div>Chargement...</div>;

  const statCards = [
    { title: 'Membres', value: stats.members, icon: Users, color: 'bg-blue-500' },
    { title: 'Entretiens en attente', value: stats.pendingInterviews, icon: Calendar, color: 'bg-orange-500' },
    { title: 'Événements à venir', value: stats.upcomingEvents, icon: Bell, color: 'bg-purple-500' },
    { title: 'Projets actifs', value: stats.activeProjects, icon: Activity, color: 'bg-green-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenue sur {club?.name}
        </h2>
        <p className="text-gray-600">
          Résumé des activités de votre club
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

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
            <a
              href="/events"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Voir tous les événements →
            </a>
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
                time={new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <a
              href="/interviews"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Gérer les entretiens →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;