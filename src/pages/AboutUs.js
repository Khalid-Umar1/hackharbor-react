import { useState, useEffect } from 'react';
import TeamMember from '../components/TeamMember';
import ValueCard from '../components/ValueCard';

export default function AboutUs({ theme }) {
  const [team, setTeam] = useState([]);
  const [values, setValues] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('/team.json')
      .then(res => res.json())
      .then(data => setTeam(data))
      .catch(err => console.error('Error loading team:', err));

    fetch('/values.json')
      .then(res => res.json())
      .then(data => setValues(data))
      .catch(err => console.error('Error loading values:', err));
  }, []);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      {/* Mission Section */}
      <section className={`py-20 ${isDark ? 'bg-gradient-to-br from-bg-dark to-card' : 'bg-gradient-to-br from-blue-50 to-gray-100'}`}>
        <div className="container mx-auto px-5">
          <h2 className={`text-4xl mb-6 font-bold text-center ${isDark ? 'text-primary' : 'text-primary-light'}`}>
            About HackHarbor
          </h2>
          <p className={`text-lg text-center max-w-3xl mx-auto mb-8 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
            HackHarbor is dedicated to building the next generation of cybersecurity professionals 
            through hands-on learning, real-world challenges, and a supportive community.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-16 ${isDark ? 'bg-bg-dark' : 'bg-white'}`}>
        <div className="container mx-auto px-5">
          <h3 className={`text-3xl mb-12 font-bold text-center ${isDark ? 'text-primary' : 'text-primary-light'}`}>
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, idx) => (
              <ValueCard key={idx} value={value} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-16 ${isDark ? 'bg-bg-dark' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-5">
          <h3 className={`text-3xl mb-12 font-bold text-center ${isDark ? 'text-primary' : 'text-primary-light'}`}>
            Meet Our Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <TeamMember key={idx} member={member} theme={theme} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}