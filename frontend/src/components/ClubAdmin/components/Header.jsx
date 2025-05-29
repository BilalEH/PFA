import { Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const { user, club, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-800">
            {club?.name || 'Club Dashboard'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center">
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-800">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {club?.role?.replace('_', ' ') || ''}
              </p>
            </div>
            
            <div className="relative group">
              <button
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
                aria-label="User menu"
              >
                <User size={20} className="text-gray-600" />
              </button>
              
              <div className="absolute right-0 hidden mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 group-hover:block">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </a>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
