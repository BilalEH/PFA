import React, { useEffect, useState } from 'react'
import { MapPin, Edit } from 'lucide-react'
import axios from 'axios'

export default function ClubInfo({ clubId = 2 }) {
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axios.get(`/api/clubs/${clubId}`)
        setClub(response.data)
      } catch (error) {
        console.error('Failed to fetch club:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClub()
  }, [clubId])

  if (loading) return <div>Loading club info...</div>
  if (!club) return <div>Club not found.</div>

  return (
    <div className="space-y-6">
      <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={club.cover_image || 'https://via.placeholder.com/1200x300'}
          alt="Club Banner"
          className="object-cover w-full h-full"
        />
        <button className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center space-x-1">
          <Edit className="w-4 h-4" />
          <span>Edit Information</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold">Club Information</h2>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-300 rounded-lg overflow-hidden">
              <img
                src={club.logo || 'https://via.placeholder.com/96'}
                alt="Club Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">{club.name}</h3>
              <div className="flex items-center text-gray-600 space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{club.location || 'No location provided'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium">About the Club</h4>
            <p className="mt-1 text-gray-700">{club.description}</p>
          </div>

          <div>
            <h4 className="font-medium">Club Rules</h4>
            {club.rules ? (
              <p className="mt-1 text-gray-700">{club.rules}</p>
            ) : (
              <p className="mt-1 text-gray-400 italic">No rules defined</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h4 className="font-medium text-gray-700">Club Details</h4>
          <dl className="space-y-2 text-gray-800">
            <div>
              <dt className="font-semibold">Club Name</dt>
              <dd>{club.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">Founded</dt>
              <dd>
                {club.foundation_date
                  ? new Date(club.foundation_date).toLocaleDateString()
                  : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Status</dt>
              <dd>
                <span className={`inline-block px-2 py-0.5 text-sm rounded ${
                  club.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {club.is_active ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}