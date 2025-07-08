// src/App.tsx

import React, { useState } from 'react';
import { useCurrentUser, useLogin, useLogout } from './hooks/auth';

const App: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    loginMutation.mutate({ username, password });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) return <div>Loading user...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>React Query Auth Demo</h1>

      {user ? (
        <>
          <p>Welcome, <strong>{user.name}</strong> (role: {user.role})</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
          {loginMutation.isError && <p style={{ color: 'red' }}>Login failed</p>}
        </>
      )}
    </div>
  );
};

export default App;
