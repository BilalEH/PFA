import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import StudentLayout from '../layouts/StudentLayout';
import ClubAdminLayout from '../layouts/ClubAdminLayout';
import SystemAdminLayout from '../layouts/SystemAdminLayout';
import AuthRedirect from '../apiConfig/AuthRedirect';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import HomePage from '../components/auth/home';
import Profile from '../components/users/Profil';

const ClubsPage = () => <h1>Liste des clubs disponibles</h1>;
const EventsPage = () => <h1>Événements à venir</h1>;

// Pages protégées
const StudentDashboard = () => <h1>Espace étudiant</h1>;
const ClubAdminDashboard = () => <h1>Espace administrateur de club</h1>;
const SystemAdminDashboard = () => <h1>Espace administrateur système</h1>;

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        element: <AuthRedirect />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'clubs', element: <ClubsPage /> },
          { path: 'events', element: <EventsPage /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'applications', element: <h1>Mes candidatures</h1> },
      { path: 'events', element: <h1>Événements étudiants</h1> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/club-admin',
    element: <ClubAdminLayout />,
    children: [
      { path: 'dashboard', element: <ClubAdminDashboard /> },
      { path: 'members', element: <h1>Gestion des membres</h1> },
      { path: 'interviews', element: <h1>Entretiens</h1> },
    ],
  },
  {
    path: '/system-admin',
    element: <SystemAdminLayout />,
    children: [
      { path: 'dashboard', element: <SystemAdminDashboard /> },
      { path: 'users', element: <h1>Gestion des utilisateurs</h1> },
      { path: 'clubs', element: <h1>Gestion des clubs</h1> },
    ],
  },
]);