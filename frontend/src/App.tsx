import { useState, useEffect } from 'react';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [user, setUser] = useState<any>(null); // simple global state for demo

  useEffect(() => {
    // Check local storage for user
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app-container animate-fade-in">
      <nav className="navbar">
        <div className="nav-brand">Nexus Workspace</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name}</span>
          <button className="btn btn-glass" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {user.role === 'ADMIN' ? (
          <AdminPanel user={user} />
        ) : (
          <Dashboard user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
