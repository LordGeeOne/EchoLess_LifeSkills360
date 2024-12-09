import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaLocationArrow, FaMapMarkerAlt, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TOWNSHIPS } from '../data/townships';
import './MapPage.css'; // Ensure CSS is imported for styling

// Helper function to get township image
const getTownshipImage = (townshipName) => {
  try {
    return `/assets/images/townships/${townshipName.toLowerCase()}.jpeg`;
  } catch (error) {
    return '/assets/images/townships/default.jpeg'; // Fallback image
  }
};

// Remove the TOWNSHIPS constant from this file since it's now imported

// Define the loadHereMaps function
const loadHereMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.H) {
      resolve(window.H);
    } else {
      const scripts = [
        "https://js.api.here.com/v3/3.1/mapsjs-core.js",
        "https://js.api.here.com/v3/3.1/mapsjs-service.js",
        "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
        "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
      ];

      const loadScript = (src) => {
        return new Promise((res, rej) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = res;
          script.onerror = () => rej(new Error(`Failed to load script ${src}`));
          document.body.appendChild(script);
        });
      };

      // Load scripts sequentially
      scripts.reduce((promise, src) => {
        return promise.then(() => loadScript(src));
      }, Promise.resolve())
      .then(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";
        document.head.appendChild(link);
        resolve(window.H);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
    }
  });
};

// Add near top of file with other constants
const CUSTOM_MARKER_PATH = '/assets/images/custom-marker.png'; // Update this path to match your image location

function MapPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTownship, setSelectedTownship] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const [ui, setUi] = useState(null);  // Add this new state
  const [clickedMarker, setClickedMarker] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null); // Single marker state to replace others
  const [backgroundImage, setBackgroundImage] = useState('/assets/images/townships/default.jpeg'); // Update the initial backgroundImage state to use an absolute path

  // Remove initial township selection
  useEffect(() => {
    // Initial township selection removed
  }, []);

  const clearMarkers = () => {
    try {
      if (!map) return;
      
      if (currentMarker) {
        try {
          map.removeObject(currentMarker);
        } catch (err) {
          console.warn('Error removing marker:', err);
        }
        setCurrentMarker(null);
      }

      // Clear info bubbles
      if (ui) {
        ui.getBubbles().forEach(bubble => ui.removeBubble(bubble));
      }
      
      // Don't reset selectedTownship here anymore
      // setSelectedTownship(null); <- Remove this line
    } catch (error) {
      console.error('Error in clearMarkers:', error);
    }
  };

  const findNearestTownship = (userLat, userLng) => {
    let nearest = null;
    let minDistance = Infinity;

    Object.entries(TOWNSHIPS).forEach(([province, townships]) => {
      townships.forEach(township => {
        const distance = calculateDistance(
          userLat,
          userLng,
          township.coords.lat,
          township.coords.lng
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = { ...township, province };
        }
      });
    });
    
    if (nearest) {
      setSelectedTownship(nearest);
      setBackgroundImage(nearest.image); // Add background change
      addTownshipMarker(nearest);
      
      // Find and scroll to the township element
      setTimeout(() => {
        const townshipElement = document.querySelector(`[data-township="${nearest.name}"]`);
        if (townshipElement) {
          scrollToTownship(townshipElement);
        }
      }, 100);
    }
    return nearest;
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
    return R * c;
  };

  const addTownshipMarker = (township) => {
    if (!map || !window.H || !ui) return;
    
    clearMarkers();

    // Create marker with custom icon
    const icon = new window.H.map.Icon(`
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="red">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `);

    const marker = new window.H.map.Marker(township.coords, { icon });
    
    // Close any existing info bubbles
    ui.getBubbles().forEach(bubble => ui.removeBubble(bubble));

    // Add info bubble
    const bubble = new window.H.ui.InfoBubble(township.coords, {
      content: `<div style="padding: 8px">
        <b>${township.name}</b><br/>
        ${township.province}
      </div>`
    });

    // Add click event to marker
    marker.addEventListener('tap', () => {
      // Close any existing info bubbles first
      ui.getBubbles().forEach(b => ui.removeBubble(b));
      ui.addBubble(bubble);
    });

    map.addObject(marker);
    setCurrentMarker(marker);
    centerMapOnCoords(township.coords);
  };

  const getUserLocation = () => {
    setSearchTerm(''); // Clear search when using location
    if (!map) return;
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = { lat: latitude, lng: longitude };
          
          // Clear existing markers
          clearMarkers();

          // Add animated user location marker
          const userIcon = new window.H.map.Icon(
            CUSTOM_MARKER_PATH,
            {
              // Increased size of the icon
              size: { w: 80, h: 80 },
              // Adjust anchor point for larger size
              anchor: { x: 32, y: 64 }
            }
          );

          const marker = new window.H.map.Marker(userCoords, { icon: userIcon });
          map.addObject(marker);
          setCurrentMarker(marker);

          centerMapOnCoords(userCoords);

          // Find and highlight nearest township
          const nearest = findNearestTownship(latitude, longitude);
          if (nearest) {
            // Toast notification instead of alert
            const toast = document.createElement('div');
            toast.textContent = `Nearest township: ${nearest.name} in ${nearest.province}`;
            toast.style.cssText = `
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 10px 20px;
              border-radius: 20px;
              z-index: 1000;
              animation: fadeInOut 3s forwards;
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
          }

          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please make sure location services are enabled.");
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  // Update filterTownships to return full township data
  const filterTownships = () => {
    const filtered = [];
    Object.entries(TOWNSHIPS).forEach(([province, townships]) => {
      townships.forEach(township => {
        if (township.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          filtered.push({ ...township, province });
        }
      });
    });
    return filtered;
  };

  // Add new effect to handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = filterTownships();
      if (filtered.length > 0) {
        // Select first matching township
        const firstMatch = filtered[0];
        setSelectedTownship(firstMatch);
        setBackgroundImage(firstMatch.image); // Add background change
        if (map && window.H) {
          addTownshipMarker(firstMatch);
        }
        
        // Scroll to matching township
        setTimeout(() => {
          const element = document.querySelector(`[data-township="${firstMatch.name}"]`);
          if (element) {
            scrollToTownship(element);
          }
        }, 100);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    loadHereMaps().then((H) => {
      const platform = new H.service.Platform({
        apikey: "CAm9HX6lBXJ49NbVVhU005UU6YiJWLzK1IPaC_qTI7E", // Replace with your actual API key
      });
      const defaultLayers = platform.createDefaultLayers();

      // Initialize main map with South Africa coordinates
      const map = new H.Map(
        document.getElementById("mapContainer"),
        defaultLayers.vector.normal.map,
        {
          zoom: 5,  // Changed from 6 to 5 for more zoomed out view
          center: { lat: -30.5595, lng: 22.9375 },  // Coordinates for South Africa
        }
      );

      // Enable map events for main map
      const mapEvents = new H.mapevents.MapEvents(map);
      new H.mapevents.Behavior(mapEvents);

      // Store UI reference
      const ui = H.ui.UI.createDefault(map, defaultLayers);
      setUi(ui);
      setMap(map);

      // Add map tap event listener
      map.addEventListener('tap', (evt) => {
        const coords = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        
        clearMarkers();

        // Updated marker creation with absolute positioning and size
        const icon = new H.map.Icon(
          CUSTOM_MARKER_PATH,
          {
            // Increased size of the icon
            size: { w: 64, h: 64 },
            // Adjust anchor point for larger size
            anchor: { x: 32, y: 64 }
          }
        );

        const marker = new H.map.Marker(
          { lat: coords.lat, lng: coords.lng },
          { icon }
        );

        map.addObject(marker);
        setCurrentMarker(marker);

        findNearestTownship(coords.lat, coords.lng);
      });

    }).catch((error) => {
      console.error("Error loading HERE Maps:", error);
      alert("Failed to load map. Please try again later.");
    });
  }, []);

  const proceedToApp = () => {
    if (selectedTownship) {
      navigate('/', { 
        state: { 
          backgroundImage: selectedTownship.image,
          townshipName: selectedTownship.name
        },
        replace: true // Add this to replace the current entry in history
      });
    }
  };

  const scrollToTownship = (element) => {
    if (!element) return;
    const container = scrollContainerRef.current;
    const centerPosition = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
    container.scrollTo({ left: centerPosition, behavior: 'smooth' });
  };

  const handleTownshipClick = (township) => {
    const fullTownshipData = TOWNSHIPS[township.province].find(t => t.name === township.name);
    if (fullTownshipData) {
      const selectedData = { 
        ...fullTownshipData, 
        province: township.province 
      };
      
      setSelectedTownship(selectedData);
      setBackgroundImage(fullTownshipData.image);

      // Store background in sessionStorage
      sessionStorage.setItem('lastBackgroundImage', fullTownshipData.image);
      sessionStorage.setItem('lastTownshipName', township.name);

      // Add marker without clearing selection
      if (map && window.H) {
        clearMarkers();
        const icon = new window.H.map.Icon(
          CUSTOM_MARKER_PATH,
          {
            size: { w: 64, h: 64 },
            anchor: { x: 32, y: 64 }
          }
        );
        
        const marker = new window.H.map.Marker(selectedData.coords, { icon });
        map.addObject(marker);
        setCurrentMarker(marker);
        
        centerMapOnCoords(selectedData.coords);
      }

      // Scroll to township
      const element = document.querySelector(`[data-township="${township.name}"]`);
      if (element) {
        scrollToTownship(element);
      }
    }
  };

  const centerMapOnCoords = (coords, animate = true) => {
    if (!map) return;
    
    if (animate) {
      map.getViewModel().setLookAtData({
        position: coords,
        zoom: 12,
        animation: {
          type: 'linear',
          duration: 1000
        }
      });
    } else {
      map.setCenter(coords);
      map.setZoom(12);
    }
  };

  const navigateTownship = (direction) => {
    if (!selectedTownship) {
      // If no township selected, select the first one
      const firstTownship = Object.values(TOWNSHIPS)[0][0];
      handleTownshipClick({ ...firstTownship, province: Object.keys(TOWNSHIPS)[0] });
      return;
    }

    // Flatten townships array with province info
    const allTownships = Object.entries(TOWNSHIPS).flatMap(([province, townships]) =>
      townships.map(township => ({ ...township, province }))
    );

    // Find current index
    const currentIndex = allTownships.findIndex(
      t => t.name === selectedTownship.name && t.province === selectedTownship.province
    );

    if (currentIndex === -1) return;

    // Calculate next index
    let nextIndex;
    if (direction === 'left') {
      nextIndex = currentIndex === 0 ? allTownships.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex === allTownships.length - 1 ? 0 : currentIndex + 1;
    }

    // Select next township
    handleTownshipClick(allTownships[nextIndex]);
  };

  // Update scrollCarousel to include township navigation
  const scrollCarousel = (direction) => {
    navigateTownship(direction);
    
    // Existing scroll behavior
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 250;
    const newPosition = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        scrollCarousel('left');
      } else if (e.key === 'ArrowRight') {
        scrollCarousel('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedTownship]); // Add selectedTownship as dependency

  return (
    <div style={{
      position: 'fixed',
      top: '50px', // Changed from 70px to match new header height
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
      background: '#000', // Add a default background color to prevent grey showing
    }}>
      {backgroundImage && (
        <div
          className="background-transition"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px) brightness(0.5)', // Darker background
            opacity: 0.9, // Increased opacity
            transition: 'all 1s ease-in-out',
            zIndex: 0,
            backgroundColor: '#000', // Add a background color as fallback
          }}
        />
      )}
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '500px 400px',
        gridGap: '40px',
        padding: '20px',
        maxWidth: '100%',
        margin: '0 auto',
        minHeight: '100vh',
        alignContent: 'start',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        background: backgroundImage 
          ? 'rgba(0, 0, 0, 0.5)' // Darker overlay
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        {/* Left column with map */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div id="mapContainer" style={{ 
            width: "500px", // Smaller map
            height: "350px", // Adjusted height
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden'
          }}></div>
          <a 
            onClick={() => window.location.reload()}
            style={{
              position: 'absolute',
              top: '8px',           // Changed from bottom to top
              right: '8px',         // Changed from left to right
              color: '#666',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            Clear markers
          </a>
        </div>

        {/* Right column with search and description */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '0 20px',
          height: '350px', // Match map height
          position: 'relative' // For absolute positioning of button
        }}>
          {/* Search input with location button */}
          <div style={{ 
            position: 'relative', 
            width: '100%'
          }}>
            <input
              type="text"
              placeholder="Search for your kasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '45px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            />
            <button 
              onClick={getUserLocation}
              disabled={isLoading}
              title="Find nearest township to my location"
              style={{
                position: 'absolute',
                right: '12px',
                top: '30%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaMapMarkerAlt 
                size={20} 
                style={{
                  color: isLoading ? '#ccc' : '#2196F3',
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                }}
              />
            </button>
          </div>

          {/* Description panel with fixed height */}
          <div
            style={{
              padding: '0px',
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              flex: 1, // Take remaining space
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                opacity: 1, // Always visible
                transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                overflow: 'auto', // Allow scroll if content is too long
                flex: 1 // Take remaining space
              }}
            >
              {selectedTownship ? (
                <div style={{
                  animation: 'fadeIn 0.5s ease-in-out'
                }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0',
                    fontSize: '2.5em', // Increased from 2em
                    fontWeight: '12'
                  }}>
                    {selectedTownship.name}
                  </h3>
                  <p style={{ 
                    margin: 0,
                    lineHeight: '1.4', // Increased from 1.2
                    fontSize: '1.4em'  // Increased from 1em
                  }}>
                    {selectedTownship.description}
                  </p>
                </div>
              ) : (
                <div style={{
                  color: '#fff',
                  textAlign: 'center',
                  padding: '20px',
                  animation: 'fadeIn 0.5s ease-in-out'
                }}>
                  <h3 style={{ fontSize: '1.8em', marginBottom: '15px' }}>
                    Find Your Kasi
                  </h3>
                  <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>
                    Click anywhere on the map or use the location button above. 
                    We'll help you find the closest township to your location.
                  </p>
                </div>
              )}
            </div>

            {/* Button fixed to bottom */}
            <button 
              onClick={proceedToApp} 
              className="proceed-button"
              style={{
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1.2em',
                opacity: selectedTownship ? 0.8 : 0,
                transform: `translateY(${selectedTownship ? '0' : '10px'})`,
                transition: 'all 1s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaPlay size={16} />
              Go to {selectedTownship?.name || 'App'}
            </button>
          </div>
        </div>

        {/* Full width section under map */}
        <div style={{ 
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%', // Changed from 100vw
          position: 'relative',
          marginLeft: '0', // Remove negative margins
          marginRight: '0'
        }}>
          {/* Carousel wrapper with fade effects */}
          <div style={{
            position: 'relative',
            width: '100%',
          }}>
            <button
              onClick={() => scrollCarousel('left')}
              style={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100,
                color: '#fff',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                padding: 0,
                outline: 'none'
              }}
            >
              <FaChevronLeft size={20} style={{ display: 'block' }} />
            </button>
            <div
              ref={scrollContainerRef}
              style={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                padding: '20px 0',
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                background: 'transparent',
                paddingLeft: '40px',
                paddingRight: '40px',
                position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent)'
              }}
            >
              <div style={{ display: 'inline-block', width: '20%' }}></div>
              {(searchTerm ? filterTownships() : Object.entries(TOWNSHIPS).flatMap(([province, townships]) =>
                townships.map(township => ({ ...township, province }))
              )).map((township) => (
                <div
                  key={`${township.province}-${township.name}`}
                  data-township={township.name}
                  onClick={() => handleTownshipClick(township)}
                  style={{
                    display: 'inline-block',
                    width: selectedTownship && selectedTownship.name === township.name 
                      ? '250px'  // Larger selected image
                      : '200px',
                    height: selectedTownship && selectedTownship.name === township.name 
                      ? '187.5px'  // Maintain aspect ratio
                      : '150px',
                    margin: '0 10px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    scrollSnapAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    transform: selectedTownship && selectedTownship.name === township.name 
                      ? 'scale(1.2)' // Increased scale
                      : 'scale(1)',
                    transition: 'all 0.3s ease-in-out',
                    zIndex: selectedTownship && selectedTownship.name === township.name ? 10 : 1,
                  }}
                >
                  <img
                    src={township.image}
                    alt={township.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: selectedTownship && selectedTownship.name === township.name 
                        ? 'none' 
                        : 'grayscale(100%)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '10px',
                      background: selectedTownship && selectedTownship.name === township.name 
                        ? 'rgba(76, 175, 80, 0.9)' 
                        : 'rgba(0, 0, 0, 0.7)',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    {township.name}
                  </div>
                </div>
              ))}
              <div style={{ display: 'inline-block', width: '20%' }}></div>
            </div>
            <button
              onClick={() => scrollCarousel('right')}
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100,
                color: '#fff',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                padding: 0,
                outline: 'none'
              }}
            >
              <FaChevronRight size={20} style={{ display: 'block' }} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Add this CSS to your MapPage.css file or add it inline in the component
const styles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
    85% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Add hover effect styles */
  button:hover .location-icon {
    transform: scale(1.1);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .background-transition {
    transition: all 0.5s ease-in-out;
  }

  button:hover {
    background: rgba(0, 0, 0, 0.8) !important;
    transform: translateY(-50%) scale(1.1) !important;
  }
`;

export default MapPage;