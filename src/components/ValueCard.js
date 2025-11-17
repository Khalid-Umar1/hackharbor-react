export default function ValueCard({ value, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl p-8 text-center hover:-translate-y-1 transition-all shadow-lg ${
      isDark 
        ? 'bg-card border border-brand hover:border-accent hover:shadow-accent/15' 
        : 'bg-white border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
    }`}>
      <div className="text-5xl mb-4">{value.icon}</div>
      <h3 className={`text-xl mb-3 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
        {value.title}
      </h3>
      <p className={`text-sm ${isDark ? 'text-muted' : 'text-muted-light'}`}>
        {value.description}
      </p>
    </div>
  );
}