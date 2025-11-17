import { useState, useEffect } from 'react';
import TrainingModule from '../components/TrainingModule';

export default function Training({ theme }) {
  const [modules, setModules] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('/training.json')
      .then(res => res.json())
      .then(data => setModules(data))
      .catch(err => console.error('Error loading training modules:', err));
  }, []);

  return (
    <main className={`min-h-screen py-16 ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className="container mx-auto px-5">
        <h2 className={`text-4xl mb-4 font-bold text-center ${isDark ? 'text-primary' : 'text-primary-light'}`}>
          Training Modules
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${isDark ? 'text-muted' : 'text-muted-light'}`}>
          Master cybersecurity skills through hands-on training
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modules.map((module, idx) => (
            <TrainingModule key={idx} module={module} theme={theme} />
          ))}
        </div>
      </div>
    </main>
  );
}