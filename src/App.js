import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Training from './pages/Training';
import CTF from './pages/CTF';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import GitHubUserSearch from './components/GitHubUserSearch';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage. getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const isDark = theme === 'dark';

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${theme}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className={isDark ? 'bg-bg-dark' : 'bg-bg-light'}>
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/events" element={<Events theme={theme} />} />
            <Route path="/training" element={<Training theme={theme} />} />
            <Route path="/ctf" element={<CTF theme={theme} />} />
            <Route path="/about" element={<AboutUs theme={theme} />} />
            <Route path="/login" element={<Login theme={theme} />} />
            <Route path="/signup" element={<SignUp theme={theme} />} />
            <Route path="/dashboard" element={<Dashboard theme={theme} />} />
            <Route path="/create-post" element={<CreatePost theme={theme} />} />
            <Route path="/edit-post/:id" element={<EditPost theme={theme} />} />
            <Route path="/profile" element={<Profile theme={theme} />} />
            <Route path="/github-search" element={
              <main className={`min-h-screen py-16 ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                <div className="container mx-auto px-5">
                  <GitHubUserSearch theme={theme} />
                </div>
              </main>
            } />
          </Routes>
        </div>
        <Footer theme={theme} />
      </div>
    </Router>
  );
}

export default App;