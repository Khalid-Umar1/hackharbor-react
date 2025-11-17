export default function TeamMember({ member, theme }) {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl p-8 text-center hover:-translate-y-1 transition-all shadow-lg ${
      isDark 
        ? 'bg-card border border-brand hover:border-accent hover:shadow-accent/15' 
        : 'bg-card-light border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
    }`}>
      <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl ${
        isDark ? 'bg-brand' : 'bg-brand-light'
      }`}>
        {member.avatar}
      </div>
      <h3 className={`text-2xl mb-2 font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
        {member.name}
      </h3>
      <p className={`mb-4 font-medium ${isDark ? 'text-accent' : 'text-accent-light'}`}>
        {member.role}
      </p>
      <p className={`text-sm ${isDark ? 'text-muted' : 'text-muted-light'}`}>
        {member.bio}
      </p>
    </div>
  );
}