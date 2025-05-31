import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  User,
  ChevronDown,
  Mail,
  X,
  Check,
  UserPlus
} from 'lucide-react'

import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress
} from '@mui/material'

const mockUser = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  role: 'president'
}

const mockClub = {
  id: 'club1',
  name: 'Computer Science Club',
  role: 'president'
}

function MemberCard({ member, isCurrentUser, canManage, onRoleChange }) {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const roles = [
    'member',
    'admin',
    'president',
    'vice_president',
    'secretary',
    'treasurer'
  ]
  const roleColors = {
    president: 'bg-purple-100 text-purple-800',
    vice_president: 'bg-indigo-100 text-indigo-800',
    secretary: 'bg-blue-100 text-blue-800',
    treasurer: 'bg-green-100 text-green-800',
    admin: 'bg-yellow-100 text-yellow-800',
    member: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex-shrink-0 mr-4">
        {member.profile_image ? (
          <img
            src={member.profile_image}
            alt={`${member.first_name} ${member.last_name}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {member.first_name} {member.last_name}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-gray-500">(You)</span>
          )}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="mt-1 flex items-center">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleColors[member.role]}`}
          >
            {member.role.replace('_', ' ')}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            Joined {new Date(member.joined_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {canManage && !isCurrentUser && (
        <div className="flex-shrink-0 ml-4 relative">
          <button
            onClick={() => setIsRoleMenuOpen((open) => !open)}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Change Role <ChevronDown className="ml-1 h-4 w-4" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(member.id, role)
                    setIsRoleMenuOpen(false)
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                    member.role === role
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {member.role === role && (
                    <Check className="mr-2 h-4 w-4 text-blue-500" />
                  )}
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Members() {
  const user = mockUser
  const club = mockClub

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [members, setMembers] = useState([
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      role: 'president',
      joined_at: '2022-09-01',
      profile_image:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      role: 'vice_president',
      joined_at: '2022-09-05',
      profile_image:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ])

  const canManageMembers = ['president', 'vice_president', 'admin'].includes(
    club?.role || ''
  )

  const handleRoleChange = (id, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    )
    alert(`Role updated to ${newRole.replace('_', ' ')} for member ID ${id}`)
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase()
    const matchesName = fullName.includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole ? member.role === selectedRole : true
    return matchesName && matchesRole
  })

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
        sx={{ gap: 2 }}
      >
        <CircularProgress color="primary" thickness={4.5} size={50} />
        <Typography variant="body1" color="text.secondary">
          Chargement des membres du club...
        </Typography>
      </Box>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Club Members</h2>
        {canManageMembers && (
          <Button
            variant="contained"
            startIcon={<UserPlus className="h-5 w-5" />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Member
          </Button>
        )}
      </div>

      {/* FORMULAIRE D’AJOUT */}
      {isFormOpen && (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            const newMember = {
              id: (members.length + 1).toString(),
              first_name: e.target.first_name.value,
              last_name: e.target.last_name.value,
              email: e.target.email.value,
              role: e.target.role.value,
              joined_at: new Date().toISOString().split('T')[0],
              profile_image: ''
            }
            setMembers((prev) => [...prev, newMember])
            setIsFormOpen(false)
            e.target.reset()
          }}
          sx={{
            p: 3,
            mb: 4,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: '#fff'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Member
          </Typography>

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
            <TextField name="first_name" label="First Name" fullWidth required />
            <TextField name="last_name" label="Last Name" fullWidth required />
          </Stack>

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2 }}>
            <TextField name="email" label="Email" type="email" fullWidth required />
            <FormControl fullWidth required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select name="role" labelId="role-label" label="Role" defaultValue="">
                <MenuItem value="president">President</MenuItem>
                <MenuItem value="vice_president">Vice President</MenuItem>
                <MenuItem value="secretary">Secretary</MenuItem>
                <MenuItem value="treasurer">Treasurer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="member">Member</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Add Member
            </Button>
          </Box>
        </Box>
      )}

      {/* FILTRES */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedRole || ''}
              onChange={(e) => setSelectedRole(e.target.value || null)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
            >
              <option value="">All Roles</option>
              <option value="president">President</option>
              <option value="vice_president">Vice President</option>
              <option value="secretary">Secretary</option>
              <option value="treasurer">Treasurer</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>
      </div>

      {/* AFFICHAGE DES MEMBRES */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isCurrentUser={member.id === user.id}
              canManage={canManageMembers}
              onRoleChange={handleRoleChange}
            />
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">
              No members found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Members
