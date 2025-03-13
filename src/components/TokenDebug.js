// components/TokenDebug.js
import React, { useState, useEffect } from 'react';
import { tokenService } from '../utils/tokenService';

const TokenDebug = () => {
  const [accessToken, setAccessToken] = useState(tokenService.getAccessToken());
  const [refreshToken, setRefreshToken] = useState(tokenService.getRefreshToken());
  const [decodedAccess, setDecodedAccess] = useState(null);
  const [decodedRefresh, setDecodedRefresh] = useState(null);
  const [isValid, setIsValid] = useState({
    accessFormat: false,
    accessExpiration: false,
    refreshFormat: false,
    refreshExpiration: false
  });
  const [showTokens, setShowTokens] = useState(false);

  useEffect(() => {
    // Check token format validity
    const accessFormatValid = tokenService.isValidJwtFormat(accessToken);
    const refreshFormatValid = tokenService.isValidJwtFormat(refreshToken);
    
    // Check token expiration validity
    const accessExpirationValid = tokenService.isAccessTokenValid();
    const refreshExpirationValid = tokenService.isRefreshTokenValid();
    
    setIsValid({
      accessFormat: accessFormatValid,
      accessExpiration: accessExpirationValid,
      refreshFormat: refreshFormatValid,
      refreshExpiration: refreshExpirationValid
    });
    
    // Try to decode tokens
    try {
      if (accessFormatValid) {
        // For security, we only show decoded tokens in non-production environments
        if (process.env.NODE_ENV !== 'production') {
          const decoded = accessToken.split('.')[1];
          setDecodedAccess(JSON.parse(atob(decoded)));
        }
      }
    } catch (error) {
      console.error('Error decoding access token:', error);
    }
    
    try {
      if (refreshFormatValid) {
        // For security, we only show decoded tokens in non-production environments
        if (process.env.NODE_ENV !== 'production') {
          const decoded = refreshToken.split('.')[1];
          setDecodedRefresh(JSON.parse(atob(decoded)));
        }
      }
    } catch (error) {
      console.error('Error decoding refresh token:', error);
    }
  }, [accessToken, refreshToken]);

  // Refresh tokens from localStorage periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAccessToken(tokenService.getAccessToken());
      setRefreshToken(tokenService.getRefreshToken());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleClearTokens = () => {
    if (window.confirm('Are you sure you want to clear all tokens?')) {
      tokenService.clearTokens();
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md my-4 text-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-yellow-800">Auth Token Debugger</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowTokens(!showTokens)}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
          >
            {showTokens ? 'Hide Tokens' : 'Show Tokens'}
          </button>
          <button 
            onClick={handleClearTokens}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
          >
            Clear Tokens
          </button>
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div>
          <span className="font-medium">Access Token:</span> {' '}
          <span className={`px-2 py-0.5 rounded ${isValid.accessFormat && isValid.accessExpiration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isValid.accessFormat ? (isValid.accessExpiration ? 'Valid' : 'Expired') : 'Invalid Format'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Refresh Token:</span> {' '}
          <span className={`px-2 py-0.5 rounded ${isValid.refreshFormat && isValid.refreshExpiration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isValid.refreshFormat ? (isValid.refreshExpiration ? 'Valid' : 'Expired') : 'Invalid Format'}
          </span>
        </div>
        
        {showTokens && (
          <div className="space-y-3 mt-3">
            {accessToken && (
              <div>
                <p className="font-medium">Access Token Value:</p>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto max-h-16">
                  <code className="text-xs break-all">{accessToken}</code>
                </div>
                
                {decodedAccess && (
                  <div className="mt-2">
                    <p className="font-medium">Decoded Access Token:</p>
                    <pre className="bg-gray-100 p-2 rounded overflow-x-auto max-h-32 text-xs">
                      {JSON.stringify(decodedAccess, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            {refreshToken && (
              <div>
                <p className="font-medium">Refresh Token Value:</p>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto max-h-16">
                  <code className="text-xs break-all">{refreshToken}</code>
                </div>
                
                {decodedRefresh && (
                  <div className="mt-2">
                    <p className="font-medium">Decoded Refresh Token:</p>
                    <pre className="bg-gray-100 p-2 rounded overflow-x-auto max-h-32 text-xs">
                      {JSON.stringify(decodedRefresh, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <p>* This component is for debugging only and should be removed in production.</p>
      </div>
    </div>
  );
};

export default TokenDebug;