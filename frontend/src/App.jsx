import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const pageStyle = {
  marginLeft: 220,
  marginTop: 56,
  padding: 28,
  minHeight: 'calc(100vh - 56px)',
  background: '#f4f6fb',
};

export default function App() {
  const [authTab, setAuthTab] = useState('signin');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setAuthTab('signin'); };
  const handleUserUpdate = (updated) => setUser(updated);

  if (!user) {
    return authTab === 'signin'
      ? <Login onTabChange={setAuthTab} onLogin={handleLogin} />
      : <Register onTabChange={setAuthTab} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'profile': return <Profile user={user} onUserUpdate={handleUserUpdate} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div>
      <Sidebar activePage={page} onNavigate={setPage} user={user} />
      <Topbar page={page} onLogout={handleLogout} />
      <div style={pageStyle}>{renderPage()}</div>
    </div>
  );
}
