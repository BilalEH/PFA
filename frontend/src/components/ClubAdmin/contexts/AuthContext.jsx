import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Pour la démo, on pré-remplit avec un admin de club mock
  const [user, setUser] = useState({
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    user_type: 'club_admin'
  })

  const [club, setClub] = useState({
    id: '1',
    name: 'Computer Science Club',
    role: 'president'
  })

  const login = (newUser, newClub) => {
    setUser(newUser)
    setClub(newClub)
  }

  const logout = () => {
    setUser(null)
    setClub(null)
  }

  const value = {
    user,
    club,
    login,
    logout,
    isAuthenticated: Boolean(user)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
