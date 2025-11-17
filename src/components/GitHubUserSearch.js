import { useState } from 'react';

export default function GitHubUserSearch({ theme }) {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  const searchUsers = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setUsers([]);

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${username}&per_page=10`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.items || []);

      if (data.items.length === 0) {
        setError('No users found');
      }
    } catch (err) {
      setError('Error fetching users. Please try again.');
      console.error('GitHub API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  return (
    <div className={`rounded-xl p-8 shadow-lg ${
      isDark 
        ? 'bg-card border border-brand' 
        : 'bg-card-light border border-brand-light'
    }`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-primary' : 'text-primary-light'}`}>
        GitHub User Search
      </h2>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter GitHub username..."
          className={`flex-1 border-2 rounded-lg px-4 py-3 transition-all ${
            isDark 
              ? 'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent' 
              : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
          } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
          disabled={loading}
        />
        <button
          onClick={searchUsers}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-bold transition-all ${
            isDark 
              ? 'bg-accent text-bg-dark hover:bg-primary' 
              : 'bg-accent-light text-white hover:bg-primary-light'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="bg-error/20 border border-error text-error px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`rounded-lg p-4 transition-all hover:-translate-y-1 shadow-md ${
                isDark 
                  ? 'bg-brand border border-brand hover:border-accent' 
                  : 'bg-white border border-brand-light hover:border-accent-light'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-16 h-16 rounded-full border-2 border-accent"
                />
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
                    {user.login}
                  </h3>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm transition-colors ${
                      isDark ? 'text-accent hover:text-primary' : 'text-accent-light hover:text-primary-light'
                    }`}
                  >
                    View Profile →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && !error && (
        <div className={`text-center py-12 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
          <p className="text-lg">🔍 Search for GitHub users to see results</p>
          <p className="text-sm mt-2">Try searching for: "torvalds", "gaearon", or "Khalid-Umar1"</p>
        </div>
      )}
    </div>
  );
}