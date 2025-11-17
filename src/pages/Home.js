import { useState, useEffect } from 'react';
import FeatureCard from '../components/FeatureCard';
import AIChatBox from '../components/AIChatBox';

export default function Home({ theme }) {
  const [features, setFeatures] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('/features.json')
      .then(res => res.json())
      .then(data => setFeatures(data))
      .catch(err => console.error('Error loading features:', err));
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className={`py-24 ${isDark ? 'bg-gradient-to-br from-bg-dark to-card' : 'bg-gradient-to-br from-blue-50 to-gray-100'}`}>
        <div className="container mx-auto px-5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-5xl mb-6 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
              Learn | Hack | Secure — Welcome to HackHarbor
            </h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-muted' : 'text-muted-light'}`}>
              HackHarbor is a hands-on cyber security playground: practice offensive and defensive techniques, 
              study real breach reports, and compete in Capture The Flag challenges. Build skills safely and responsibly.
            </p>
            <button className={`px-8 py-4 text-lg font-bold rounded-lg transition-all ${
              isDark 
                ? 'bg-accent text-bg-dark hover:bg-primary hover:-translate-y-0.5' 
                : 'bg-accent-light text-white hover:bg-primary-light hover:-translate-y-0.5'
            }`}>
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className={isDark ? 'py-16 bg-bg-dark' : 'py-16 bg-white'}>
        <div className="container mx-auto px-5">
          <h3 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-primary' : 'text-primary-light'}`}>
            Introduction to HackHarbor
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-xl shadow-2xl"
                src="https://www.youtube.com/embed/inWWhr5tnEA"
                title="Cybersecurity Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${isDark ? '' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} title={feature.title} description={feature.description} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className={`py-16 ${isDark ? 'bg-gradient-to-br from-card to-bg-dark' : 'bg-gradient-to-br from-gray-100 to-white'}`}>
        <div className="container mx-auto px-5">
          <AIChatBox theme={theme} />
        </div>
      </section>
    </main>
  );
}