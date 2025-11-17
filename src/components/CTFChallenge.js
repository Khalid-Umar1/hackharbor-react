export default function CTFChallenge({ challenge, theme }) {
  const isDark = theme === 'dark';
  
  const difficultyColors = {
    Easy: isDark ? 'bg-accent/20 text-accent' : 'bg-green-100 text-green-700',
    Medium: isDark ? 'bg-warning/20 text-warning' : 'bg-yellow-100 text-yellow-700',
    Hard: isDark ? 'bg-error/20 text-error' : 'bg-red-100 text-red-700'
  };

  return (
    <div className={`rounded-xl p-6 hover:-translate-y-1 transition-all shadow-lg ${
      isDark 
        ? 'bg-card border border-brand hover:border-accent hover:shadow-accent/15' 
        : 'bg-card-light border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-3xl ${isDark ? '' : 'grayscale-0'}`}>{challenge.icon}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>
      <h3 className={`text-xl mb-2 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
        {challenge.title}
      </h3>
      <p className={`text-sm mb-4 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
        {challenge.description}
      </p>
      <div className={`flex justify-between items-center text-sm ${isDark ? 'text-text' : 'text-text-light'}`}>
        <span>🏆 {challenge.points} pts</span>
        <button className={`px-4 py-2 rounded-lg font-bold transition-all text-sm ${
          isDark 
            ? 'bg-brand text-text hover:bg-accent hover:text-bg-dark' 
            : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white'
        }`}>
          Solve
        </button>
      </div>
    </div>
  );
}