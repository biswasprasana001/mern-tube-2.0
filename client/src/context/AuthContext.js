import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ authToken: null, username: null, userId: null });

  const logout = () => {
    setAuthState({ authToken: null, username: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};