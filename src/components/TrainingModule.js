export default function TrainingModule({ module, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl p-8 hover:-translate-y-1 transition-all shadow-lg w-full ${
      isDark 
        ? 'bg-card border border-brand hover:border-accent hover:shadow-accent/15' 
        : 'bg-card-light border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
          isDark ? 'bg-accent/20 text-accent' : 'bg-accent-light/20 text-accent-light'
        }`}>
          {module.level}
        </span>
        <span className={`text-sm ${isDark ? 'text-muted' : 'text-muted-light'}`}>
          {module.duration}
        </span>
      </div>
      <h3 className={`text-2xl mb-3 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
        {module.title}
      </h3>
      <p className={`mb-6 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
        {module.description}
      </p>
      <button className={`px-6 py-3 rounded-lg font-bold transition-all w-full ${
        isDark 
          ? 'bg-accent text-bg-dark hover:bg-primary' 
          : 'bg-accent-light text-white hover:bg-primary-light'
      }`}>
        Start Module
      </button>
    </div>
  );
}