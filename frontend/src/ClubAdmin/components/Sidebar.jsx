import { NavLink } from 'react-router-dom'
import {
  Home,
  Info,
  Users,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react'

function Sidebar() {
  // Static dummy data for club
  const club = {
    role: 'admin', // try 'president', 'admin', or other roles to test conditional rendering
  }

  const navigation = [
    { name: 'Dashboard', to: '/', icon: Home, end: true },
    { name: 'Club Info', to: '/club-info', icon: Info },
    { name: 'Members', to: '/members', icon: Users },
    { name: 'Interviews', to: '/interviews', icon: MessageSquare },
    { name: 'Events', to: '/events', icon: Calendar }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Club Admin</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navigation.map(({ name, to, icon: Icon, end }) => (
          <NavLink
            key={name}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="mr-3 h-5 w-5" />
            {name}
          </NavLink>
        ))}
      </nav>

      {(club.role === 'president' || club.role === 'admin') && (
        <div className="p-4 border-t border-gray-200">
          <NavLink
            to="/settings"
            className="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default Sidebar
