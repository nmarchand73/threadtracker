import React from 'react';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleMicrosoftLogin = () => {
    // In a real implementation, we would use chrome.identity.launchWebAuthFlow
    // to authenticate with Microsoft OAuth
    
    // For the MVP, we're implementing a simple placeholder
    console.log('Microsoft login initiated');
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to ThreadTracker</h2>
        <p className="login-description">
          Track and manage your stalled email threads in Outlook Web.
        </p>
        
        <button 
          className="microsoft-login-button" 
          onClick={handleMicrosoftLogin}
        >
          <span className="microsoft-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
          </span>
          Sign in with Microsoft
        </button>
        
        <p className="login-note">
          You'll need to grant permission for ThreadTracker to access your Outlook emails.
        </p>
      </div>
    </div>
  );
};

export default Login; 