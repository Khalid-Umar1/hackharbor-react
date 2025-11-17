export default function FeatureCard({ title, description, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl p-8 hover:-translate-y-1 transition-all shadow-lg ${
      isDark 
        ? 'bg-card border border-brand hover:border-accent hover:shadow-accent/15' 
        : 'bg-card-light border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
    }`}>
      <h3 className={`text-2xl mb-4 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
        {title}
      </h3>
      <p className={isDark ? 'text-muted' : 'text-muted-light'}>
        {description}
      </p>
    </div>
  );
}