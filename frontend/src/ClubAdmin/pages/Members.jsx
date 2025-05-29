function Members() {
  const user = { id: '1', first_name: 'John', last_name: 'Doe' }
  const club = { role: 'president' }

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)

  const [members, setMembers] = useState([
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      role: 'president',
      joined_at: '2022-09-01',
      is_active: true,
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
      is_active: true,
      profile_image:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    // Add more mock members here
  ])

  const canManageMembers = ['president', 'vice_president', 'admin'].includes(
    club.role
  )

  const handleRoleChange = (id, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    )
    alert(`Role updated to ${newRole.replace('_', ' ')} for member ID ${id}`)
  }

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase()
    const matchesName = fullName.includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole ? member.role === selectedRole : true
    return matchesName && matchesRole
  })

  return (
    <div>
      {/* ... existing JSX UI unchanged ... */}
    </div>
  )
}
