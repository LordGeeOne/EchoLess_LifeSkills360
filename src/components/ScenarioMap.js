import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import LeaderboardPage from './LeaderboardPage';
import { questions } from '../data/questions';
import { TOWNSHIPS } from '../data/townships';
import "./ScenarioMap.css";

function ScenarioMap() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update how we get the background image
  const { 
    backgroundImage = '/assets/images/townships/default.jpeg', 
    townshipName = 'Your Township' 
  } = location.state || {};

  useEffect(() => {
    if (location.state?.backgroundImage) {
      // If we have a background image from state, store it in sessionStorage
      sessionStorage.setItem('lastBackgroundImage', location.state.backgroundImage);
      sessionStorage.setItem('lastTownshipName', location.state.townshipName);
    } else {
      // If no state, try to get from sessionStorage
      const savedBackground = sessionStorage.getItem('lastBackgroundImage');
      const savedTownship = sessionStorage.getItem('lastTownshipName');
      if (savedBackground) {
        navigate('/', { 
          state: { 
            backgroundImage: savedBackground,
            townshipName: savedTownship
          },
          replace: true
        });
      }
    }
  }, [location.state, navigate]);

  const [scenarioProgress, setScenarioProgress] = useState({});

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('scores')) || {};
    setScenarioProgress(storedScores);
  }, []);

  // Add background loading check
  useEffect(() => {
    // Test if background image exists
    const img = new Image();
    img.onerror = () => {
      console.error('Failed to load background image:', backgroundImage);
      // Fallback to absolute backup image if main one fails
      const fallbackImage = process.env.PUBLIC_URL + '/assets/images/default-township.jpg';
      const backgroundElement = document.querySelector('.background-transition');
      if (backgroundElement) {
        backgroundElement.style.backgroundImage = `url(${fallbackImage})`;
      }
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  const scenarios = [
    { 
      title: "The Party or the Pitfall?", 
      icon: "/assets/images/scenarios/party.jpeg", 
      completion: scenarioProgress["The Party or the Pitfall?"] || 0,
      locked: questions["The Party or the Pitfall?"].length === 0,
      steps: questions["The Party or the Pitfall?"] 
    },
    { 
      title: "One Puff, One Regret?", 
      icon: "/assets/images/scenarios/smoking.jpeg",
      completion: scenarioProgress["One Puff, One Regret?"] || 0,
      locked: questions["One Puff, One Regret?"].length === 0, 
      steps: questions["One Puff, One Regret?"] 
    },
    { 
      title: "The Social Media Dare", 
      icon: "/assets/images/scenarios/social-media.jpeg",
      completion: scenarioProgress["The Social Media Dare"] || 0,
      locked: questions["The Social Media Dare"].length === 0, 
      steps: questions["The Social Media Dare"] 
    },
    { 
      title: "Friend in Need, Friend Indeed?", 
      icon: "/assets/images/scenarios/friendship.jpeg",
      completion: scenarioProgress["Friend in Need, Friend Indeed?"] || 0,
      locked: questions["Friend in Need, Friend Indeed?"].length === 0, 
      steps: questions["Friend in Need, Friend Indeed?"] 
    },
    { 
      title: "The Unsupervised Weekend", 
      icon: "/assets/images/scenarios/weekend.jpeg",
      completion: scenarioProgress["The Unsupervised Weekend"] || 0,
      locked: questions["The Unsupervised Weekend"].length === 0, 
      steps: questions["The Unsupervised Weekend"] 
    },
    { 
      title: "The Test Stress", 
      icon: "/assets/images/scenarios/test.jpeg",
      completion: scenarioProgress["The Test Stress"] || 0,
      locked: questions["The Test Stress"].length === 0, 
      steps: questions["The Test Stress"] 
    },
    { 
      title: "The Older Kid's Offer", 
      icon: "/assets/images/scenarios/peer-pressure.jpeg",
      completion: scenarioProgress["The Older Kid's Offer"] || 0,
      locked: questions["The Older Kid's Offer"].length === 0, 
      steps: questions["The Older Kid's Offer"] 
    },
  ];

  const handleSelectScenario = (scenario) => {
    if (!scenario.locked) {
      const gamePath = getGamePathByTitle(scenario.title);
      navigate(`/game/${gamePath}`, { 
        state: { 
          scenario: { ...scenario, steps: scenario.steps },
          backgroundImage,
          townshipName 
        } 
      });
    } else {
      alert("This scenario is currently locked.");
    }
  };

  const getGamePathByTitle = (title) => {
    const pathMap = {
      "The Party or the Pitfall?": "party",
      "One Puff, One Regret?": "smoking",
      "The Social Media Dare": "social-media",
      "Friend in Need, Friend Indeed?": "friendship",
      "The Unsupervised Weekend": "unsupervised",
      "The Test Stress": "test",
      "The Older Kid's Offer": "peer-pressure"
    };
    return pathMap[title] || 'default';
  };

  const [textPosition, setTextPosition] = useState(0);

  // Extract unique township names from TOWNSHIPS
  const townships = Object.entries(TOWNSHIPS).flatMap(([_, townships]) =>
    townships.map(t => t.name)
  );

  // Auto scroll text carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setTextPosition(prev => (prev - 1) % (townships.length * 150)); // 150px per township
    }, 50); // Smoother animation with shorter interval

    return () => clearInterval(timer);
  }, [townships.length]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [scenarioRequest, setScenarioRequest] = useState({ title: '', description: '' });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log('New scenario request:', scenarioRequest);
    alert('Thank you for your scenario suggestion!');
    setScenarioRequest({ title: '', description: '' });
    setShowRequestModal(false);
  };

  // Add embedded games data
  const embeddedGames = [
    {
      title: "Survival Karts",
      thumbnail: "https://www.onlinegames.io/media/posts/887/responsive/survival-karts-play-xs.jpg",
      url: "https://cloud.onlinegames.io/games/2024/unity3/survival-karts/index-og.html",
      description: "Looking for the coolest, most chaotic online racing game? Play Survival Karts!",
      tags: ["3d", "battle", "racing", "multiplayer"]
    },
    {
      title: "Drift King",
      thumbnail: "https://www.onlinegames.io/media/posts/729/responsive/Drift-King-xs.jpg",
      url: "https://www.onlinegames.io/games/2024/unity/drift-king/index.html",
      description: "Premium 3D drift racing with 10 sports cars and 6 maps.",
      tags: ["3d", "car", "drift", "multiplayer"]
    },
    {
      title: "Highway Traffic",
      thumbnail: "https://www.onlinegames.io/media/posts/32/responsive/Highway-Traffic-2-xs.jpg",
      url: "https://www.onlinegames.io/games/2022/unity/highway-traffic/index.html",
      description: "Dodge traffic and avoid accidents in this endless driving game.",
      tags: ["3d", "car", "traffic", "endless"]
    },
    {
      title: "Stickman Parkour",
      thumbnail: "https://www.onlinegames.io/media/posts/871/responsive/stickman-parkour-OG-xs.jpg",
      url: "https://cloud.onlinegames.io/games/2024/construct/219/stickman-parkour/index-og.html",
      description: "Help Stickman navigate through 30 challenging parkour levels!",
      tags: ["2d", "action", "parkour", "platformer"]
    },
    {
      title: "GTA Simulator",
      thumbnail: "https://www.onlinegames.io/media/posts/416/responsive/GTA-Simulator-xs.jpg",
      url: "https://www.onlinegames.io/games/2023/unity2/gta-simulator/index.html",
      description: "Free online GTA-style simulator game playable in your browser.",
      tags: ["3d", "action", "driving", "shooting"]
    },
    {
      title: "Block Blast",
      thumbnail: "https://www.onlinegames.io/media/posts/876/responsive/block-blast-xs.jpg",
      url: "https://cloud.onlinegames.io/games/2024/unity3/block-blast/index-og.html",
      description: "Relaxing Tetris-style puzzle game without time pressure.",
      tags: ["2d", "puzzle", "arcade", "logic"]
    }
  ];

  // Add confessions data
  const confessionVideos = [
    {
      id: 'eCwI1XHMRJA',
      title: 'My Drug Story',
      thumbnail: `https://img.youtube.com/vi/eCwI1XHMRJA/maxresdefault.jpg`,
    },
    {
      id: 'M-mt8_a6bnE',
      title: 'A Second Chance',
      thumbnail: `https://img.youtube.com/vi/M-mt8_a6bnE/maxresdefault.jpg`,
    },
    {
      id: 'INBlk5N8krA',
      title: 'Recovery Journey',
      thumbnail: `https://img.youtube.com/vi/INBlk5N8krA/maxresdefault.jpg`,
    }
  ];

  // Add state for video modal
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Add stories data
  const [stories, setStories] = useState([
    {
      id: 1,
      title: "Peer Pressure at My First Party",
      author: "Anonymous, 16",
      content: "I never thought I'd be in that situation. Everyone was drinking, and my best friend kept insisting. Here's how I stood my ground...",
      likes: 24,
      date: "2 days ago",
      tags: ["peer-pressure", "parties", "friendship"]
    },
    {
      id: 2,
      title: "How Social Media Almost Ruined My Life",
      author: "Teen Survivor, 15",
      content: "One viral post, countless regrets. I learned the hard way that what goes online, stays online. This is my story...",
      likes: 156,
      date: "1 week ago",
      tags: ["social-media", "cyberbullying", "lessons"]
    },
    {
      id: 3,
      title: "Finding Help When Family Struggles",
      author: "Hope Seeker, 17",
      content: "Living with an addicted parent isn't easy. Here's how I found support and learned to cope while helping my family...",
      likes: 89,
      date: "2 weeks ago",
      tags: ["family", "support", "mental-health"]
    },
    {
      id: 4,
      title: "My Journey Back from Gaming Addiction",
      author: "Recovery Kid, 15",
      content: "12 hours a day gaming, failing grades, lost friendships. This is how I recognized the problem and got my life back...",
      likes: 67,
      date: "3 weeks ago",
      tags: ["gaming", "addiction", "recovery"]
    }
  ]);

  const handleLikeStory = (storyId) => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, likes: story.likes + 1 } : story
    ));
  };

  // Add new state for story/video modal
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [storySubmission, setStorySubmission] = useState({
    title: '',
    content: '',
    author: '',
    tags: ''
  });
  const [videoSubmission, setVideoSubmission] = useState({
    title: '',
    description: '',
    url: ''
  });

  // Add handlers for story/video submissions
  const handleStorySubmit = (e) => {
    e.preventDefault();
    const newStory = {
      id: stories.length + 1,
      ...storySubmission,
      likes: 0,
      date: 'Just now',
      tags: storySubmission.tags.split(',').map(tag => tag.trim())
    };
    setStories([newStory, ...stories]);
    setStorySubmission({ title: '', content: '', author: '', tags: '' });
    setShowStoryModal(false);
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle video upload
    alert('Video submission received! It will be reviewed by moderators.');
    setVideoSubmission({ title: '', description: '', url: '' });
    setShowVideoModal(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative',
      zIndex: 1
    }}>
      {!townshipName || townshipName === 'Your Township' ? (
        <>
          {/* App Introduction Container */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto 2rem auto',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>
            <h2 style={{ 
              fontFamily: 'Kanit, sans-serif',
              fontSize: '2.5em',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '1rem'
            }}>
              Welcome to LifeSkills360
            </h2>
            <p style={{
              color: '#ffffff',
              fontSize: '1.2em',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Explore real-life scenarios and make decisions that shape your journey through various townships. 
              Learn valuable life skills, earn points, and compete with others while navigating challenging situations.
            </p>
            <div style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              margin: '2em 0',
              height: '50px',
              position: 'relative'
            }}>
              {/* Township scrolling text */}
              <div style={{
                display: 'inline-block',
                transform: `translateX(${textPosition}px)`,
                transition: 'transform 0.03s linear',
                whiteSpace: 'nowrap'
              }}>
                {[...townships, ...townships].map((name, i) => (
                  <span key={i} style={{
                    display: 'inline-block',
                    width: '200px',
                    textAlign: 'center',
                    fontSize: '2em',
                    color: '#fff',
                    padding: '0 10px',
                    fontFamily: 'Permanent Marker, cursive',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/map')}
              style={{
                padding: '1.5px 30px',
                fontSize: '1.2em',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              Get Started
            </button>
          </div>

          {/* Leaderboard Container */}
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>
            <LeaderboardPage />
          </div>
        </>
      ) : (
        <>
          <h2 style={{ 
            marginBottom: '2rem',
            color: '#ffffff'
          }}>
            <span style={{ fontFamily: 'Kanit, sans-serif' }}>
              Play scenarios in{' '}
            </span>
            <span style={{
              fontFamily: 'Permanent Marker, cursive',
              color: '#FF5733'
            }}>
              {townshipName}
            </span>
          </h2>
          <div className="grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Reduced minimum width
            gap: '1.5rem',
            padding: '1rem',
            alignItems: 'stretch'
          }}>
            {scenarios.map((scenario, index) => (
              <div 
                key={index} 
                onClick={() => handleSelectScenario(scenario)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  textAlign: 'center',
                  opacity: scenario.locked ? 0.5 : 1,
                  aspectRatio: '1', // Makes it square
                  height: 'auto', // Let aspect ratio control height
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => !scenario.locked && (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseLeave={e => !scenario.locked && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <img 
                  src={process.env.PUBLIC_URL + scenario.icon}
                  alt={scenario.title}
                  style={{
                    width: '100%',
                    height: '60%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}
                />
                <h3 style={{ 
                  margin: '0.5rem 0',
                  fontSize: '1rem',
                  lineHeight: '1.2'
                }}>
                  {scenario.title}
                </h3>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  marginTop: 'auto'
                }}>
                  {scenario.locked ? 'Locked' : `${scenario.completion}% Complete`}
                </div>
              </div>
            ))}
            
            {/* Add Scenario Box */}
            <div 
              onClick={() => setShowRequestModal(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                color: '#fff',
                aspectRatio: '1', // Makes it square
                height: 'auto' // Let aspect ratio control height
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '2rem', marginBottom: '1rem' }}>➕</span>
              <h3>Request New Scenario</h3>
            </div>
          </div>

          {/* Confessions Section */}
          <h2 style={{ 
            marginTop: '4rem',
            marginBottom: '2rem',
            color: '#ffffff',
            fontFamily: 'Kanit, sans-serif'
          }}>
            <span>Confessions in </span>
            <span style={{
              fontFamily: 'Permanent Marker, cursive',
              color: '#FF5733'
            }}>
              {townshipName}
            </span>
          </h2>
          <div className="grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '1rem',
            alignItems: 'stretch'
          }}>
            {confessionVideos.map((video, index) => (
              <div 
                key={index}
                onClick={() => setSelectedVideo(video)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  aspectRatio: '16/9',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 0, 0, 0.8)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '2rem' }}>▶️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Modal */}
          {selectedVideo && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}
              onClick={() => setSelectedVideo(null)}
            >
              <div style={{
                width: '90%',
                maxWidth: '960px',
                aspectRatio: '16/9',
                position: 'relative'
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '10px' }}
                ></iframe>
              </div>
            </div>
          )}

          {/* Stories Section */}
          <h2 style={{ 
            marginTop: '4rem',
            marginBottom: '2rem',
            color: '#ffffff',
            fontFamily: 'Kanit, sans-serif'
          }}>
            <span>Stories from </span>
            <span style={{
              fontFamily: 'Permanent Marker, cursive',
              color: '#FF5733'
            }}>
              {townshipName}
            </span>
          </h2>
          <div className="grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '1rem',
            alignItems: 'stretch'
          }}>
            {/* Add Story and Submit Video Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              width: '100%',
              gridColumn: '1 / -1'
            }}>
              <button
                onClick={() => setShowStoryModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                ✍️ Share Your Story
              </button>
              <button
                onClick={() => setShowVideoModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                🎥 Submit Video
              </button>
            </div>

            {stories.map((story) => (
              <div 
                key={story.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <h3 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  {story.title}
                </h3>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  By {story.author} • {story.date}
                </div>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  flex: 1
                }}>
                  {story.content}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginTop: 'auto'
                }}>
                  {story.tags.map((tag, i) => (
                    <span key={i} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleLikeStory(story.id)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    marginTop: '1rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ❤️ {story.likes} likes
                </button>
              </div>
            ))}
          </div>

          {/* Story Submission Modal */}
          {showStoryModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h2 style={{ marginBottom: '1rem', color: '#333' }}>Share Your Story</h2>
                <form onSubmit={handleStorySubmit}>
                  <input
                    type="text"
                    placeholder="Story Title"
                    value={storySubmission.title}
                    onChange={(e) => setStorySubmission({...storySubmission, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Your Name or 'Anonymous'"
                    value={storySubmission.author}
                    onChange={(e) => setStorySubmission({...storySubmission, author: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <textarea
                    placeholder="Share your experience..."
                    value={storySubmission.content}
                    onChange={(e) => setStorySubmission({...storySubmission, content: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      minHeight: '150px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={storySubmission.tags}
                    onChange={(e) => setStorySubmission({...storySubmission, tags: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowStoryModal(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: 'none',
                        background: '#4CAF50',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Share Story
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Video Submission Modal */}
          {showVideoModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h2 style={{ marginBottom: '1rem', color: '#333' }}>Submit Your Video</h2>
                <form onSubmit={handleVideoSubmit}>
                  <input
                    type="text"
                    placeholder="Video Title"
                    value={videoSubmission.title}
                    onChange={(e) => setVideoSubmission({...videoSubmission, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <textarea
                    placeholder="Video Description"
                    value={videoSubmission.description}
                    onChange={(e) => setVideoSubmission({...videoSubmission, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      minHeight: '150px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="YouTube Video URL"
                    value={videoSubmission.url}
                    onChange={(e) => setVideoSubmission({...videoSubmission, url: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowVideoModal(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: 'none',
                        background: '#4CAF50',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Submit Video
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Embedded Games Section */}
          <h2 style={{ 
            marginTop: '4rem',
            marginBottom: '2rem',
            color: '#ffffff',
            fontFamily: 'Kanit, sans-serif'
          }}>
            Mini Games
          </h2>
          <div className="grid-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            padding: '1rem',
            alignItems: 'stretch'
          }}>
            {embeddedGames.map((game, index) => (
              <div 
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  aspectRatio: '16/9',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => window.open(game.url, '_blank')}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  style={{
                    width: '100%',
                    height: '60%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
                <h3 style={{ 
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#fff'
                }}>
                  {game.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  marginBottom: '0.5rem'
                }}>
                  {game.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginTop: 'auto'
                }}>
                  {game.tags.map((tag, i) => (
                    <span key={i} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Request Modal */}
          {showRequestModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h2 style={{ marginBottom: '1rem', color: '#333' }}>Request New Scenario</h2>
                <form onSubmit={handleRequestSubmit}>
                  <input
                    type="text"
                    placeholder="Scenario Title"
                    value={scenarioRequest.title}
                    onChange={(e) => setScenarioRequest({...scenarioRequest, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <textarea
                    placeholder="Describe your scenario..."
                    value={scenarioRequest.description}
                    onChange={(e) => setScenarioRequest({...scenarioRequest, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginBottom: '1rem',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      minHeight: '150px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        border: 'none',
                        background: '#4CAF50',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Add to your CSS:
const styles = `
  @keyframes scrollText {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }
`;

export default ScenarioMap;
