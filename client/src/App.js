// client\src\App.js
import React, { useContext } from 'react';

import { AuthContext } from './context/AuthContext';

import Home from './components/Home';
import Authentication from './components/Authentication';

function App() {
  const { authState } = useContext(AuthContext);

  return (
    <div>
      {!authState.authToken ? (
        <>
          <Authentication />
        </>
      ) : (
        <>
          <Home />
        </>
      )}
    </div>
  );
}

export default App;