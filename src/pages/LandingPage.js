// src/pages/LandingPage.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import './LandingPage.css';
import { fetchLocations } from '../services/locationService';

// This is a component that will handle the location zooming
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition([latitude, longitude]);
        map.flyTo([latitude, longitude], 10); // Zoom level 10 is approximately 35-40 miles
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        // Default to a central US location if geolocation fails
        setPosition([39.8283, -98.5795]);
        map.flyTo([39.8283, -98.5795], 4); // Zoom out to show most of US
        setLoading(false);
      }
    );
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function LandingPage() {
  // State to open/close side navigation
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Default center of US
  const [mapZoom, setMapZoom] = useState(4);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch locations from the service
  useEffect(() => {
    async function getLocations() {
      try {
        setLoading(true);
        const data = await fetchLocations();
        setLocations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getLocations();
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Enable the user location marker
    setShowUserLocation(true);
  };

  const handleLocationInput = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="landing-page">

      {/* TOP BAR with Brand + Hamburger */}
      <header className="top-bar">
        <div className="logo">On the Table</div>
        <div className="hamburger-icon" onClick={toggleNav}>
          <span />
          <span />
          <span />
        </div>
      </header>

      {/* SIDE NAVIGATION (hidden until hamburger is clicked) */}
      <nav className={`side-nav ${isNavOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <a href="#mission" onClick={toggleNav}>
              Mission
            </a>
          </li>
          <li>
            <a href="#about" onClick={toggleNav}>
              About Us
            </a>
          </li>
          <li>
            <a href="#map" onClick={toggleNav}>
              Find Us
            </a>
          </li>
        </ul>
      </nav>

      {/* DARK OVERLAY when nav is open */}
      <div
        className={`overlay ${isNavOpen ? 'show' : ''}`}
        onClick={toggleNav}
      ></div>

      {/* HERO SECTION (cow image) */}
      <section className="hero">
        <img src="/cow.jpg" alt="Cow" className="hero-image" />
      </section>

      {/* MISSION STATEMENT */}
      <section id="mission" className="mission-section">
        <h2>Our Mission</h2>
        <p>
          We strive to bring the highest quality, ethically raised beef 
          directly to your table. Sustainably farmed and carefully handled, 
          our mission is to ensure every meal is both delicious and responsible.
        </p>
      </section>

      {/* ABOUT US */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          "On the Table" is a local farm dedicated to transparent, sustainable 
          practices. We believe in open pastures, healthy animals, and fair 
          treatment for our community.
        </p>
      </section>

      {/* MAP SECTION: mimic the screenshot layout */}
      <section id="map" className="map-section">
        <h2>Find a location near you.</h2>

        {/* Search bar (Your Location, More Search Options, Search) */}
        <div className="map-search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Your Location"
              className="location-input"
              value={searchQuery}
              onChange={handleLocationInput}
            />
            <button type="button" className="more-options-btn">More Search Options</button>
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>

        {/* Two-column layout: left list, right map */}
        <div className="map-content">
          <div className="location-list">
            {loading ? (
              <p>Loading locations...</p>
            ) : error ? (
              <p>{error}</p>
            ) : locations.length === 0 ? (
              <p>No locations found</p>
            ) : (
              locations.map(location => (
                <div key={location.id} className="location-item">
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                  <p>{location.city}, {location.state} {location.zip}</p>
                  <a href={`https://maps.google.com/?q=${location.address},${location.city},${location.state},${location.zip}`} target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </a>
                  <p>{location.isPublic ? 'Open to the public' : 'Private'}</p>
                </div>
              ))
            )}
          </div>

          <div className="map-view">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {!loading && !error && locations.map(location => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <div>
                      <h3>{location.name}</h3>
                      <p>{location.address}</p>
                      <p>{location.city}, {location.state} {location.zip}</p>
                      <a href={`https://maps.google.com/?q=${location.address},${location.city},${location.state},${location.zip}`} target="_blank" rel="noopener noreferrer">
                        Get Directions
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {showUserLocation && <LocationMarker />}
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
