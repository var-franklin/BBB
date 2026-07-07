import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Book, Phone, Mail, MapPin, Search } from 'lucide-react';
import L from 'leaflet';

const createLibraryIcon = () => new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapController = ({ searchTerm }) => {
    const map = useMap();
    const searchTimeoutRef = useRef();
  
    useEffect(() => {
      if (!searchTerm) return;
  
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
  
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
          );
          const data = await response.json();
  
          if (data && data[0]) {
            const { lat, lon, boundingbox } = data[0];
            
            if (boundingbox) {
              const bounds = [
                [boundingbox[0], boundingbox[2]],
                [boundingbox[1], boundingbox[3]]
              ];
              map.fitBounds(bounds);
            } else {
              map.setView([parseFloat(lat), parseFloat(lon)], 13);
            }
          }
        } catch (error) {
          console.error('Error searching location:', error);
        }
      }, 500);
  
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, [searchTerm, map]);
  
    return null;
  };
  
  

const FindLibrariesMapView = ({ libraries, searchTerm, onSearchChange }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [libraryLocations, setLibraryLocations] = useState([]);

  useEffect(() => {
    const fetchLibraryCoordinates = async () => {
      try {
        const locations = await Promise.all(
          libraries.map(async (library) => {
            try {
              const encodedAddress = encodeURIComponent(library.libraryAddress);
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
              );
              const data = await response.json();
              
              if (data && data[0]) {
                return {
                  ...library,
                  coordinates: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
                };
              }
              return null;
            } catch (error) {
              console.error(`Error geocoding address for ${library.libraryName}:`, error);
              return null;
            }
          })
        );

        const validLocations = locations.filter(location => location !== null);
        setLibraryLocations(validLocations);

        // Set map center to the first valid library location or default to a central position
        if (validLocations.length > 0) {
          setMapCenter(validLocations[0].coordinates);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching library coordinates:', error);
        setLoading(false);
      }
    };

    fetchLibraryCoordinates();
  }, [libraries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Loading library locations...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="text-gray-400 w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search for libraries or places..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

    <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-700">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

<MapController searchTerm={searchTerm} />
        {libraryLocations.map((library) => (
          <Marker
            key={library._id}
            position={library.coordinates}
            icon={createLibraryIcon()}
          >
            <Popup className="library-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">{library.libraryName}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-600">{library.libraryAddress}</p>
                  </div>
                  {library.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <p className="text-gray-600">{library.phoneNumber}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-600">{library.email}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-500">
                        {library.totalBooks.toLocaleString()} Books
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
    </div>
  );
};

export default FindLibrariesMapView;