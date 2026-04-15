import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AllJobsPage from './pages/AllJobsPage';
import './App.css';

function getCurrentPath() {
  return window.location.pathname.toLowerCase();
}

function App() {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleNavigate = (nextPath) => {
    if (nextPath !== path) {
      window.history.pushState({}, '', nextPath);
      setPath(nextPath);
    }
  };

  if (path === '/admin/login') {
    return <AdminLoginPage onNavigate={handleNavigate} />;
  }

  if (path === '/admin/register') {
    return <AdminRegisterPage onNavigate={handleNavigate} />;
  }

  if (path === '/admin/dashboard') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (path === '/user/dashboard') {
    return <UserDashboard onNavigate={handleNavigate} />;
  }

  if (path === '/jobs/browse') {
    return <AllJobsPage onNavigate={handleNavigate} />;
  }

  if (path === '/register') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }

  if (path === '/login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  return <HomePage onNavigate={handleNavigate} />;
}

export default App;
