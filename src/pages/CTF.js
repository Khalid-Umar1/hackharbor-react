import { useState, useEffect } from 'react';
import CTFChallenge from '../components/CTFChallenge';

export default function CTF({ theme }) {
  const [challenges, setChallenges] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('/ctf.json')
      .then(res => res.json())
      .then(data => setChallenges(data))
      .catch(err => console.error('Error loading CTF challenges:', err));
  }, []);

  return (
    <main className={`min-h-screen py-16 ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className="container mx-auto px-5">
        <h2 className={`text-4xl mb-4 font-bold text-center ${isDark ? 'text-primary' : 'text-primary-light'}`}>
          Capture The Flag Challenges
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${isDark ? 'text-muted' : 'text-muted-light'}`}>
          Test your skills with real-world cybersecurity challenges
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {challenges.map((challenge, idx) => (
            <CTFChallenge key={idx} challenge={challenge} theme={theme} />
          ))}
        </div>
      </div>
    </main>
  );
}