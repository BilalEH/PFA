import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Bell, UserCircle2, Settings } from 'lucide-react'

export default function Layout() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'home' },
    { to: '/club-info', label: 'Club Info', icon: 'info' },
    { to: '/members', label: 'Members', icon: 'users' },
    { to: '/interviews', label: 'Interviews', icon: 'mic' },
    { to: '/events', label: 'Events', icon: 'calendar' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 text-xl font-bold text-blue-600">Club Admin</div>
        <nav className="mt-4">
          {navItems.map((nav) => (
            <NavLink
              key={nav.to}
              to={nav.to}
              end={nav.to === '/'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                  isActive ? 'bg-blue-100 font-medium text-blue-600' : ''
                }`
              }
            >
              {/* ici tu peux remplacer par des icônes lucide-react */}
              <span className="ml-2">{nav.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full">
          <NavLink
            to="/settings"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            <span className="ml-2">Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <h1 className="text-lg font-semibold text-gray-800">Computer Science Club</h1>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="text-sm text-gray-700">
              John Doe <span className="block text-xs text-gray-400">President</span>
            </div>
            <UserCircle2 className="w-8 h-8 text-gray-500" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
