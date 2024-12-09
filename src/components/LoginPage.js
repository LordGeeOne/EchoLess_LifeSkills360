import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    auth, 
    provider, 
    signInWithPopup, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword 
} from '../firebase';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            } else {
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            }
            navigate('/map');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, provider);
            navigate('/map');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background" style={{ 
                backgroundImage: `url('/assets/images/townships/background.jpg')`
            }}></div>
            <div className="login-content">
                <div className="login-header">
                    <h1>LifeSkills360</h1>
                    <div className="sa-colors">
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                    </div>
                    <p className="tagline">Empowering Township Communities</p>
                </div>

                <form onSubmit={handleEmailAuth} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="google-login-button"
                        disabled={isLoading}
                    >
                        <img src="/assets/images/google-icon.png" alt="Google" />
                        Continue with Google
                    </button>

                    <div className="login-footer">
                        <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                        </a>
                    </div>
                </form>

                <div className="proudly-sa">
                    <p>Proudly South African</p>
                    <div className="sa-flag-icon" style={{ 
                        backgroundImage: `url('/assets/images/sa-flag.jpeg')`
                    }}></div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;