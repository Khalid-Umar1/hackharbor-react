import { useState } from 'react';

export default function AIChatBox({ theme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      console.log('Sending to Google Gemini API...');

      // CORRECT GOOGLE GEMINI API ENDPOINT
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a cybersecurity expert. Answer this question clearly and concisely: ${userInput}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gemini Response:', data);

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiText
      }]);

    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('API key')) {
        errorMessage = 'API key not configured. Please check your .env file.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Model not found. The API endpoint may have changed.';
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${errorMessage}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className={`rounded-xl p-6 max-w-2xl mx-auto shadow-lg ${
      isDark 
        ? 'bg-card border border-brand' 
        : 'bg-card-light border border-brand-light'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
          Ask AI About Cybersecurity
        </h3>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className={`text-sm transition-colors ${
              isDark ? 'text-muted hover:text-error' : 'text-muted-light hover:text-red-600'
            }`}
          >
            Clear Chat
          </button>
        )}
      </div>

      <div className={`mb-4 p-3 rounded-lg text-sm ${isDark ? 'bg-bg-dark' : 'bg-gray-100'}`}>
        <p className={isDark ? 'text-muted' : 'text-muted-light'}>
          🤖 Powered by Google Gemini 1.5 Flash | Status:{' '}
          {process.env.REACT_APP_GEMINI_API_KEY ? (
            <span className={isDark ? 'text-accent' : 'text-accent-light'}>✅ Ready</span>
          ) : (
            <span className="text-error">❌ Not Configured</span>
          )}
        </p>
      </div>

      <div className={`h-96 overflow-y-auto mb-4 p-4 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-gray-50'}`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className={`mb-4 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
              Ask me anything about cybersecurity! 🔐
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['What is SQL injection?', 'Explain XSS attacks', 'What is penetration testing?', 'How does encryption work?'].map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    isDark 
                      ? 'bg-brand/50 text-text hover:bg-brand' 
                      : 'bg-brand-light text-text-light hover:bg-gray-300'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block px-4 py-3 rounded-lg max-w-[85%] ${
                msg.role === 'user'
                  ? isDark ? 'bg-accent text-bg-dark' : 'bg-accent-light text-white'
                  : msg.content.includes('❌')
                  ? 'bg-error/20 text-error border border-error'
                  : isDark ? 'bg-brand text-text' : 'bg-white text-text-light border border-brand-light'
              }`}
            >
              <p className="text-xs font-bold mb-1 opacity-70">
                {msg.role === 'user' ? '👤 You' : '🤖 Gemini AI'}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-left">
            <div className={`inline-block px-4 py-2 rounded-lg ${isDark ? 'bg-brand/50' : 'bg-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`animate-spin h-4 w-4 border-2 border-t-transparent rounded-full ${
                  isDark ? 'border-accent' : 'border-accent-light'
                }`}></div>
                <p className={isDark ? 'text-muted' : 'text-muted-light'}>Gemini is thinking...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Ask me anything about cybersecurity..."
          className={`flex-1 border-2 rounded-lg px-4 py-2 transition-colors ${
            isDark 
              ? 'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent' 
              : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
          } focus:outline-none`}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={`px-6 py-2 rounded-lg font-bold transition-all min-w-[80px] ${
            isDark 
              ? 'bg-accent text-bg-dark hover:bg-primary' 
              : 'bg-accent-light text-white hover:bg-primary-light'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>

      <p className={`text-xs mt-3 text-center ${isDark ? 'text-muted' : 'text-muted-light'}`}>
        💡 Ask specific questions about cybersecurity topics
      </p>
    </div>
  );
}