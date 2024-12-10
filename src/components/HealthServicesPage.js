import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaFilter, FaSpinner } from 'react-icons/fa';
import { SERVICES } from '../data/services';
import { TOWNSHIPS } from '../data/townships';  // Add this import

const SERVICE_CATEGORIES = {
  'emergency': { label: 'Emergency Services', color: '#ff4444' },
  'medical': { label: 'Medical Centers', color: '#4CAF50' },
  'police': { label: 'Police Stations', color: '#2196F3' },
  'rehab': { label: 'Rehabilitation Centers', color: '#9C27B0' },
  'therapy': { label: 'Therapy & Counseling', color: '#FF9800' }
};

const loadHereMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.H) {
      resolve(window.H);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
    script.onload = () => {
      // Load additional HERE Maps scripts
      const scripts = [
        'https://js.api.here.com/v3/3.1/mapsjs-service.js',
        'https://js.api.here.com/v3/3.1/mapsjs-ui.js',
        'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'
      ];

      Promise.all(scripts.map(src => {
        return new Promise((res, rej) => {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = src;
          script.onload = res;
          script.onerror = rej;
          document.body.appendChild(script);
        });
      }))
      .then(() => {
        // Also load CSS for UI
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
        document.head.appendChild(link);

        resolve(window.H);
      })
      .catch(reject);
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Returns distance in kilometers
};

function HealthServicesPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRange, setSelectedRange] = useState(50); // Default 50km range
  const [map, setMap] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const backgroundImage = location?.state?.backgroundImage || 
                         sessionStorage.getItem('lastBackgroundImage') || 
                         '/assets/images/townships/default.jpeg';
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilters, setActiveFilters] = useState(Object.keys(SERVICE_CATEGORIES));
  const [sortBy, setSortBy] = useState('distance'); // 'distance' or 'name'
  const [selectedServiceType, setSelectedServiceType] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const townshipName = sessionStorage.getItem('lastTownshipName');
  const [mapUI, setMapUI] = useState(null); // Add this state for UI controls

  const getInitialCoords = useCallback(() => {
    if (!townshipName) return { lat: -26.2041, lng: 28.0473 };
    for (const [province, townships] of Object.entries(TOWNSHIPS)) {
      const township = townships.find(t => t.name === townshipName);
      if (township) return township.coords;
    }
    return { lat: -26.2041, lng: 28.0473 };
  }, [townshipName]);

  const centerMapOnCoords = useCallback((coords, zoom = 15) => {
    if (!map) return;
    map.getViewModel().setLookAtData({
      position: coords,
      zoom: zoom,
      animation: { type: 'linear', duration: 1000 }
    });
  }, [map]);

  const handleServiceSelect = useCallback((service) => {
    if (!map || !service) return;
    
    // Clean up first
    map.removeObjects(map.getObjects());
    setSelectedService(service);

    try {
      // Create marker directly using coords object
      const marker = new window.H.map.Marker(service.coords);
      map.addObject(marker);
      map.setCenter(service.coords);
      map.setZoom(16);
    } catch (error) {
      console.error("Failed to place marker:", error);
    }
  }, [map]);

  const filterServices = useCallback((coords = userLocation, type = selectedServiceType) => {
    return Object.values(SERVICES)
      .flat()
      .filter(service => {
        const matchesSearch = !searchTerm || 
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = type === 'all' || service.type === type;
        
        if (!matchesSearch || !matchesType) return false;
        
        if (coords) {
          const distance = calculateDistance(
            coords.lat,
            coords.lng,
            service.coords.lat,
            service.coords.lng
          );
          return distance <= selectedRange;
        }
        return true;
      })
      .map(service => ({
        ...service,
        distance: coords ? calculateDistance(
          coords.lat,
          coords.lng,
          service.coords.lat,
          service.coords.lng
        ) : null
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [searchTerm, selectedRange, userLocation, selectedServiceType]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const H = await loadHereMaps();
        const platform = new H.service.Platform({
          apikey: "CAm9HX6lBXJ49NbVVhU005UU6YiJWLzK1IPaC_qTI7E"
        });
        
        const defaultLayers = platform.createDefaultLayers();
        const coords = getInitialCoords();
        
        const mapElement = document.getElementById("healthMapContainer");
        if (!mapElement) return;

        const mapInstance = new H.Map(
          mapElement,
          defaultLayers.vector.normal.map,
          {
            zoom: 12,
            center: coords
          }
        );

        // Add map behavior
        new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));

        setMap(mapInstance);

        // Clean up on unmount
        return () => {
          if (mapInstance) {
            mapInstance.dispose();
          }
        };
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initMap();
  }, [getInitialCoords]);

  useEffect(() => {
    const coords = userLocation || getInitialCoords();
    const filtered = filterServices(coords);
    setServices(filtered);
  }, [searchTerm, selectedServiceType, selectedRange, userLocation, filterServices, getInitialCoords]);

  // Add this useEffect to load initial services
  useEffect(() => {
    const initialServices = Object.values(SERVICES)
      .flat()
      .map(service => ({
        ...service,
        distance: userLocation ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          service.coords.lat,
          service.coords.lng
        ) : null
      }));
    setServices(initialServices);
  }, []);

  const getUserLocation = useCallback(() => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserLocation(coords);
        centerMapOnCoords(coords, 13);
        
        const filtered = filterServices(coords);
        setServices(filtered);
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [centerMapOnCoords, filterServices]);

  const addUserMarker = (coords) => {
    if (!map || !window.H) return;
    
    // Create custom user marker using window.H instead of H
    const userIcon = new window.H.map.Icon(`
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="#4CAF50" stroke="white" stroke-width="2">
          <animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `);
    
    const marker = new window.H.map.Marker(coords, { icon: userIcon });
    map.addObject(marker);
  };

  const updateNearbyServices = (userCoords) => {
    const allServices = Object.values(SERVICES)
      .flat()
      .filter(service => activeFilters.includes(service.type))
      .map(service => ({
        ...service,
        distance: calculateDistance(
          userCoords.lat,
          userCoords.lng,
          service.coords.lat,
          service.coords.lng
        )
      }));

    // Sort services by distance or name
    allServices.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      return a.name.localeCompare(b.name);
    });

    setServices(allServices);
  };

  const FilterSection = useMemo(() => {
    return React.memo(({ selectedServiceType, onServiceTypeChange }) => (
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontSize: '1.1em' }}>
          Service Type
        </label>
        <select
          value={selectedServiceType}
          onChange={(e) => {
            onServiceTypeChange(e.target.value);
            const coords = userLocation || getInitialCoords();
            const filtered = filterServices(coords, e.target.value);
            setServices(filtered);
          }}
          className="service-select"
        >
          <option value="all">All Services</option>
          {Object.entries(SERVICE_CATEGORIES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
    ));
  }, [filterServices, userLocation, getInitialCoords]);

  const RangeSection = useMemo(() => {
    return () => (
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', fontSize: '1.1em' }}>
            Range: {selectedRange}km
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={selectedRange}
            onChange={(e) => setSelectedRange(Number(e.target.value))}
            className="range-slider"
          />
        </div>
        <button
          onClick={getUserLocation}
          disabled={isLoading}
          className="location-button"
          title="Find services near me"
        >
          {isLoading ? <FaSpinner className="spin"/> : <FaMapMarkerAlt />}
        </button>
      </div>
    );
  }, [isLoading]);

  const ServiceCard = useMemo(() => {
    return React.memo(({ service, selectedService, onSelect, index }) => (
      <div
        onClick={() => onSelect(service)}
        className={`service-card ${selectedService?.name === service.name ? 'selected-service' : ''}`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          cursor: 'pointer',
          color: '#fff',
          animation: `fadeIn 0.3s ease-out forwards ${index * 0.1}s`
        }}
      >
        <h3>{service.name}</h3>
        <p style={{ opacity: 0.8 }}>{SERVICE_CATEGORIES[service.type].label}</p>
        <p>{service.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaPhone />
            <a href={`tel:${service.phone}`} style={{ color: '#4CAF50' }}>
              {service.phone}
            </a>
          </div>
          {service.distance && (
            <span className="distance-badge">
              {service.distance.toFixed(1)} km
            </span>
          )}
        </div>
      </div>
    ));
  }, []);

  // Memoized filtered services
  const filteredServices = useMemo(() => {
    const coords = userLocation || getInitialCoords();
    return filterServices(coords, selectedServiceType);
  }, [userLocation, selectedServiceType, searchTerm, selectedRange, filterServices, getInitialCoords]);

  return (
    <div className="health-services-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="background-transition" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(20px) brightness(0.5)',
        opacity: 0.9,
        transition: 'all 1s ease-in-out',
        zIndex: 0
      }} />

      <div className="services-grid" style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '20px',
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="services-list" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '2em' }}>
            Help Services {townshipName ? `in ${townshipName}` : ''}
          </h2>
          
          <FilterSection 
            selectedServiceType={selectedServiceType}
            onServiceTypeChange={setSelectedServiceType}
          />
          <RangeSection />

          <div style={{ 
            maxHeight: 'calc(90vh - 200px)',
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            {filteredServices.slice(0, 100).map((service, index) => ( // Limit to 100 items
              <ServiceCard 
                key={service.name} 
                service={service} 
                selectedService={selectedService}
                onSelect={handleServiceSelect}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="map-container">
          <div id="healthMapContainer" style={{
            height: '400px', // Reduced from 500px
            maxHeight: '50vh', // Reduced from 70vh
            width: '100%',
            maxWidth: '600px', // Added max-width
            margin: '0 auto', // Center the map
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }} />
        </div>
      </div>
    </div>
  );
}

// Optimize component export
export default React.memo(HealthServicesPage, (prevProps, nextProps) => {
  return true; // Component has no props to compare
});
