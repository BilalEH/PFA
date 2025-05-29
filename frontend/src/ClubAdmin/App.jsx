import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ClubInfo from './pages/ClubInfo'
import Members from './pages/Members'
import Interviews from './pages/Interviews'
import Events from './pages/Events'
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="club-info" element={<ClubInfo />} />
            <Route path="members" element={<Members />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="events" element={<Events />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
