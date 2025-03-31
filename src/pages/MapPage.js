import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { fetchFarminfo } from '../services/farminfoService';
import './LandingPage.css'; // Reusing same styles for now

// Farminfo marker component for user's position
function UserLocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition([latitude, longitude]);
        map.flyTo([latitude, longitude], 10);
      },
      (error) => {
        console.error("Error getting location:", error);
        setPosition([39.8283, -98.5795]);
        map.flyTo([39.8283, -98.5795], 4);
      }
    );
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [_showUserLocation] = useState(true); // Auto-show user location
  const [_mapCenter] = useState([39.8283, -98.5795]);
  const [_mapZoom] = useState(4);
  const [farminfo, setFarminfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch farminfo from the service
  useEffect(() => {
    async function getFarminfo() {
      try {
        setLoading(true);
        const data = await fetchFarminfo();
        setFarminfo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching farminfo:', err);
        setError('Failed to load farminfo. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getFarminfo();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
  };

  const handleLocationInput = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="map-page">
      <header className="top-bar">
        <div className="logo">On the Table</div>
        <a href="/" className="back-link">Back to Home</a>
      </header>

      <div className="map-container">
        <h2>Find a farm near you</h2>

        {/* Search bar */}
        <div className="map-search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Your Location"
              className="location-input"
              value={searchQuery}
              onChange={handleLocationInput}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>

        {/* Map layout */}
        <div className="map-content">
          <div className="location-list">
            {loading ? (
              <p>Loading farminfo...</p>
            ) : error ? (
              <p>{error}</p>
            ) : farminfo.length === 0 ? (
              <p>No farms found</p>
            ) : (
              farminfo.map(farm => (
                <div key={farm.id} className="location-item">
                  <h3>{farm.name}</h3>
                  <p>{farm.address}</p>
                  {farm.city && farm.state && (
                    <p>{farm.city}, {farm.state} {farm.zip}</p>
                  )}
                  <a href={`https://maps.google.com/?q=${farm.address},${farm.city || ''},${farm.state || ''},${farm.zip || ''}`} target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </a>
                  {farm.isPublic !== undefined && (
                    <p>{farm.isPublic ? 'Open to the public' : 'Private'}</p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="map-view">
            <MapContainer
              center={_mapCenter}
              zoom={_mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {!loading && !error && farminfo.map(farm => {
                // Check if we have coordinates
                const position = farm.coordinates 
                  ? [farm.coordinates.lat, farm.coordinates.lng] 
                  : null;
                
                return position && (
                  <Marker
                    key={farm.id}
                    position={position}
                  >
                    <Popup>
                      <div>
                        <h3>{farm.name}</h3>
                        <p>{farm.address}</p>
                        {farm.city && farm.state && (
                          <p>{farm.city}, {farm.state} {farm.zip}</p>
                        )}
                        <a href={`https://maps.google.com/?q=${farm.address},${farm.city || ''},${farm.state || ''},${farm.zip || ''}`} target="_blank" rel="noopener noreferrer">
                          Get Directions
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              {_showUserLocation && <UserLocationMarker />}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage; 