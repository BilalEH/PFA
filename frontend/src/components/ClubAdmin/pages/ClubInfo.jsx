import React from 'react'
import { MapPin, Edit } from 'lucide-react'

export default function ClubInfo() {
  return (
    <div className="space-y-6">
      <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
        {/* bannière */}
        <img
          src="https://via.placeholder.com/1200x300"
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
                src="https://via.placeholder.com/96"
                alt="Club Logo"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">Computer Science Club</h3>
              <div className="flex items-center text-gray-600 space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Science Building, Room 305</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium">About the Club</h4>
            <p className="mt-1 text-gray-700">
              A community for students passionate about computer science and technology. We
              organize workshops, hackathons, and guest lectures to help members develop their
              technical skills and network with industry professionals.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Club Rules</h4>
            <ol className="mt-1 list-decimal list-inside text-gray-700 space-y-1">
              <li>Respect all members</li>
              <li>Attend at least 50% of club meetings</li>
              <li>Participate in at least one club project per semester</li>
              <li>Follow the university code of conduct</li>
            </ol>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h4 className="font-medium text-gray-700">Club Details</h4>
          <dl className="space-y-2 text-gray-800">
            <div>
              <dt className="font-semibold">Club Name</dt>
              <dd>Computer Science Club</dd>
            </div>
            <div>
              <dt className="font-semibold">Founded</dt>
              <dd>September 15, 2018</dd>
            </div>
            <div>
              <dt className="font-semibold">Location</dt>
              <dd>Science Building, Room 305</dd>
            </div>
            <div>
              <dt className="font-semibold">Website</dt>
              <dd>
                <a
                  href="https://cs-club.university.edu"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  cs-club.university.edu ↗
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Status</dt>
              <dd>
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-sm rounded">
                  Active
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
