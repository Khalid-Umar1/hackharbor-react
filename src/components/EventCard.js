export default function EventCard({ event, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl p-8 hover:-translate-y-1 transition-all shadow-lg w-full ${
      isDark 
        ? 'bg-card border border-brand hover:border-accent hover:shadow-accent/15' 
        : 'bg-card-light border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
    }`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${
            isDark ? 'bg-accent/20 text-accent' : 'bg-accent-light/20 text-accent-light'
          }`}>
            {event.category}
          </span>
          <h3 className={`text-3xl mb-3 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
            {event.title}
          </h3>
          <p className={`mb-4 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
            {event.description}
          </p>
          <div className={`flex flex-wrap gap-4 text-sm mb-6 ${isDark ? 'text-text' : 'text-text-light'}`}>
            <span>📅 {event.date}</span>
            <span>⏰ {event.time}</span>
            <span>📍 {event.location}</span>
          </div>
          <button className={`px-6 py-3 rounded-lg font-bold transition-all ${
            isDark 
              ? 'bg-accent text-bg-dark hover:bg-primary hover:-translate-y-0.5' 
              : 'bg-accent-light text-white hover:bg-primary-light hover:-translate-y-0.5'
          }`}>
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}