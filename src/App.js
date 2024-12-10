import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import MiniGames from "./components/MiniGames";
import Footer from "./components/Footer";
import ScenarioMap from "./components/ScenarioMap";
import GamePage from './components/GamePage';
import LoginPage from './components/LoginPage';
import MapPage from './components/MapPage';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import RewardsPage from './components/RewardsPage';
import NotificationsPage from './components/NotificationsPage';
import LeaderboardPage from './components/LeaderboardPage';
import HealthServicesPage from './components/HealthServicesPage';
import TownshipInfo from './components/TownshipInfo';
import './App.css';
import './styles/global.css';

// Create a wrapper component to use useLocation
function AppContent() {
  const location = useLocation();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = (e) => {
    if (e.target.closest(".profile-container")) return;
    setProfileMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeProfileMenu);
    return () => document.removeEventListener("click", closeProfileMenu);
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      setCurrentStep(currentStep + 1);
    } else {
      setShowAlert(true);
    }
  };

  const handleTimeUp = () => {
    setShowAlert(true);
  };

  const retryQuestion = () => {
    setShowAlert(false);
  };

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setScore(0);
    setShowAlert(false);
  };

  // Get background from location state or sessionStorage
  const backgroundImage = location?.state?.backgroundImage || 
                         sessionStorage.getItem('lastBackgroundImage') || 
                         '/assets/images/townships/default.jpeg';

  return (
    <div className="App">
      <div
        className="background-transition"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.7)',
          opacity: 1,
          zIndex: -1,
          backgroundColor: '#000',
        }}
      />
      <Header user={user} progress={75} />
      <Routes>
        <Route path="/" element={<ScenarioMap />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/township-info" element={<TownshipInfo />} />
        <Route path="/game/party" element={<GamePage gameType="party" />} />
        <Route path="/game/smoking" element={<GamePage gameType="smoking" />} />
        <Route path="/game/social-media" element={<GamePage gameType="social-media" />} />
        <Route path="/game/friendship" element={<GamePage gameType="friendship" />} />
        <Route path="/game/unsupervised" element={<GamePage gameType="unsupervised" />} />
        <Route path="/game/test" element={<GamePage gameType="test" />} />
        <Route path="/game/peer-pressure" element={<GamePage gameType="peer-pressure" />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/health-services" element={<HealthServicesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;