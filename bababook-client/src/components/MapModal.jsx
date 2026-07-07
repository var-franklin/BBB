import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, X, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Function to format address from Nominatim response
const formatAddress = (data) => {
  if (!data) return '';

  const components = [];
  
  // Add building/amenity name if available
  if (data.address?.building || data.address?.amenity) {
    components.push(data.address.building || data.address.amenity);
  }

  // Add house number and road
  if (data.address?.house_number && data.address?.road) {
    components.push(`${data.address.house_number} ${data.address.road}`);
  } else if (data.address?.road) {
    components.push(data.address.road);
  }

  // Add suburb/neighborhood if available
  if (data.address?.suburb || data.address?.neighbourhood) {
    components.push(data.address.suburb || data.address.neighbourhood);
  }

  // Add city/town
  if (data.address?.city || data.address?.town || data.address?.village) {
    components.push(data.address.city || data.address.town || data.address.village);
  }

  // Add state/province
  if (data.address?.state || data.address?.province) {
    components.push(data.address.state || data.address.province);
  }

  // Add country
  if (data.address?.country) {
    components.push(data.address.country);
  }

  // If we still don't have any components, use the display name
  if (components.length === 0 && data.display_name) {
    return data.display_name;
  }

  return components.filter(Boolean).join(', ');
};

// Component to handle map clicks and marker placement
const MapMarker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAddressDetails = useCallback(async (lat, lng) => {
    setIsLoading(true);
    try {
      // Try with zoom level 18 first (building level)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
      );
      let data = await response.json();
      
      // If we don't get a good result, try with zoom level 14 (street level)
      if (!data || !data.address) {
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14&addressdetails=1`
        );
        data = await fallbackResponse.json();
      }

      return data;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      const addressData = await getAddressDetails(lat, lng);
      const formattedAddress = formatAddress(addressData);
      
      onLocationSelected({
        address: formattedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        coordinates: { lat, lng },
        rawData: addressData
      });
    },
  });

  return (
    <>
      {position && <Marker position={position} />}
      {isLoading && (
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg z-[1000] flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Fetching address...</span>
        </div>
      )}
    </>
  );
};

const MapModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  if (!isOpen) return null;

  const handleLocationSelected = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.address);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl overflow-hidden relative">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Select Library Location</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapMarker onLocationSelected={handleLocationSelected} />
            </MapContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Selected Location:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedLocation?.address || ''}
                readOnly
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                placeholder="Click on the map to select a location"
              />
              <button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;