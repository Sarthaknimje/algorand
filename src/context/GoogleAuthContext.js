import React, { createContext, useContext, useState, useEffect } from 'react';

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => useContext(GoogleAuthContext);

const YOUTUBE_API_KEY = 'AIzaSyBYVrcI-3CGBzVQplilpDT0oEmjL7Xl5gk';
const CLIENT_ID = '471741345215-hambujn41i7k06d628ddtlusa7hqvuqu.apps.googleusercontent.com';
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

export const GoogleAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youtubeChannel, setYoutubeChannel] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);

  const loadGapi = () => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client', () => {
          setGapiInited(true);
          resolve();
        });
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const loadGis = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        setGisInited(true);
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const initGapiClient = async () => {
    try {
      await window.gapi.client.init({
        apiKey: YOUTUBE_API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
      });

      // Load the YouTube API
      await window.gapi.client.load('youtube', 'v3');
    } catch (err) {
      console.error('Error initializing GAPI client:', err);
      throw err;
    }
  };

  const initTokenClient = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          try {
            // Set the access token for GAPI client
            window.gapi.client.setToken({
              access_token: tokenResponse.access_token
            });
            setIsAuthenticated(true);
            await fetchYoutubeChannel();
          } catch (err) {
            console.error('Error after token callback:', err);
            setError(err.message || 'Failed to fetch YouTube channel data. Please try again.');
            setIsAuthenticated(false);
          }
        } else if (tokenResponse.error) {
          handleAuthError(tokenResponse.error);
        }
      },
      error_callback: (error) => {
        console.error('Token client error:', error);
        handleAuthError(error.type || 'unknown_error');
      }
    });
    setTokenClient(client);
  };

  const handleAuthError = (errorType) => {
    if (errorType === 'access_denied') {
      setError('Access denied. Please make sure you are using a verified test account. If you are a developer, please verify your app in the Google Cloud Console.');
    } else {
      setError(`Authentication error: ${errorType}`);
    }
    setIsAuthenticated(false);
  };

  const fetchYoutubeChannel = async () => {
    try {
      // Get the access token
      const token = window.gapi.client.getToken();
      if (!token || !token.access_token) {
        throw new Error('No access token available');
      }

      // Make the API call with proper headers
      const response = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&maxResults=1',
        {
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch channel data');
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const channel = data.items[0];
        setYoutubeChannel({
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnailUrl: channel.snippet.thumbnails.default.url,
          subscriberCount: channel.statistics.subscriberCount,
          videoCount: channel.statistics.videoCount,
          viewCount: channel.statistics.viewCount
        });
      } else {
        throw new Error('No YouTube channel found');
      }
    } catch (err) {
      console.error('Error fetching YouTube channel:', err);
      if (err.message.includes('No access token')) {
        setError('Authentication required. Please sign in again.');
        setIsAuthenticated(false);
      } else if (err.message.includes('No YouTube channel')) {
        setError('No YouTube channel found. Please make sure you have a YouTube channel.');
      } else {
        setError('Failed to fetch YouTube channel data. Please try again.');
      }
      throw err;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load both GAPI and GIS
        await Promise.all([loadGapi(), loadGis()]);
        
        // Initialize GAPI client
        await initGapiClient();
        
        // Initialize token client
        initTokenClient();

      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleGoogleLogin = async () => {
    if (!tokenClient) {
      setError('Google Identity Services is not loaded yet. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we have a valid token
      const token = window.gapi.client.getToken();
      if (token && token.access_token) {
        try {
          await fetchYoutubeChannel();
          setIsAuthenticated(true);
          return;
        } catch (err) {
          // If the token is invalid, clear it
          window.gapi.client.setToken('');
        }
      }
      
      // Request new token
      tokenClient.requestAccessToken();
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.google) {
      setError('Google Identity Services is not loaded yet. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = window.gapi.client.getToken();
      if (token) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken('');
      }
      setIsAuthenticated(false);
      setYoutubeChannel(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    error,
    youtubeChannel,
    handleGoogleLogin,
    handleLogout
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">Authentication Error</p>
          <p>{error}</p>
          {error.includes('verification') && (
            <p className="mt-2 text-sm">
              If you are a developer, please:
              <ol className="list-decimal list-inside mt-1">
                <li>Go to Google Cloud Console</li>
                <li>Navigate to OAuth consent screen</li>
                <li>Add your email as a test user</li>
                <li>Verify your app if needed</li>
              </ol>
            </p>
          )}
        </div>
      )}
    </GoogleAuthContext.Provider>
  );
}; 