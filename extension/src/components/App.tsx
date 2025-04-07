import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import ThreadList from './ThreadList';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthStatus = async () => {
      try {
        // In a real implementation, we would check chrome.storage for an auth token
        // or use chrome.identity API to check authentication status
        const authToken = await new Promise<string | null>((resolve) => {
          chrome.storage.local.get(['authToken'], (result) => {
            resolve(result.authToken || null);
          });
        });
        
        setIsAuthenticated(!!authToken);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    // This will be implemented with Microsoft OAuth
    console.log('Login initiated');
    // Placeholder for now - we'll implement actual auth in next steps
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear auth token and reset state
    chrome.storage.local.remove(['authToken'], () => {
      setIsAuthenticated(false);
    });
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>ThreadTracker</h1>
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>
      
      <main>
        {isAuthenticated ? (
          <ThreadList />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
      
      <footer className="app-footer">
        <p>ThreadTracker v0.1.0</p>
      </footer>
    </div>
  );
};

export default App; 