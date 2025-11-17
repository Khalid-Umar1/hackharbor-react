import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';

export default function Events({ theme }) {
  const [events, setEvents] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('/events.json')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error loading events:', err));
  }, []);

  return (
    <main className={`min-h-screen py-16 ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className="container mx-auto px-5">
        <h2 className={`text-4xl mb-4 font-bold text-center ${isDark ? 'text-primary' : 'text-primary-light'}`}>
          Upcoming Events
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${isDark ? 'text-muted' : 'text-muted-light'}`}>
          Join our cybersecurity competitions, hackathons, and training sessions
        </p>
        
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          {events.map((event, idx) => (
            <EventCard key={idx} event={event} theme={theme} />
          ))}
        </div>
      </div>
    </main>
  );
}