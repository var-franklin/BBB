import React from 'react';
import { X, Book, MapPin, Phone, Mail, User, Clock, Globe, Users } from 'lucide-react';

const LibraryModal = ({ library, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Mock additional data
  const additionalInfo = {
    openingHours: {
      Monday: "9:00 AM - 6:00 PM",
      Tuesday: "9:00 AM - 6:00 PM",
      Wednesday: "9:00 AM - 6:00 PM",
      Thursday: "9:00 AM - 6:00 PM",
      Friday: "9:00 AM - 5:00 PM",
      Saturday: "10:00 AM - 4:00 PM",
      Sunday: "Closed"
    },
    website: "www.librarywebsite.com",
    facilities: ["Reading Room", "Computer Lab", "Study Rooms", "Children's Section"],
    membershipFee: "$20/year",
    establishedYear: "1995",
    totalMembers: 2500
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="border-b border-gray-700 pb-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">{library.libraryName}</h2>
            </div>
            <p className="text-gray-400">ID: {library._id}</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <p>{library.libraryAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p>{library.phoneNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p>{library.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <p>{additionalInfo.website}</p>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Opening Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                {Object.entries(additionalInfo.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{day}:</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Library Stats */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Library Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Book className="w-5 h-5" />
                    <span>Total Books</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{library.totalBooks}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Users className="w-5 h-5" />
                    <span>Active Members</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{additionalInfo.totalMembers}</p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {additionalInfo.facilities.map((facility) => (
                  <span 
                    key={facility}
                    className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Management */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Library Management</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <p>Head Librarian: {library.firstName} {library.lastName}</p>
                </div>
                <p className="text-sm text-gray-400">
                  Established in {additionalInfo.establishedYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;