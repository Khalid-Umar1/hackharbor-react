export default function Footer({ theme }) {
  const isDark = theme === 'dark';
  
  return (
    <footer className={`mt-auto py-8 border-t-2 ${
      isDark ? 'bg-card border-brand' : 'bg-card-light border-brand-light'
    }`}>
      <div className="container mx-auto px-5">
        <div className="text-center">
          <p className={isDark ? 'text-muted' : 'text-muted-light'}>
            © 2025 HackHarbor. Learn responsibly.
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
            Built with React, Firebase & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}