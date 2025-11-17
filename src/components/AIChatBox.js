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
      console.log('Sending message...');

      // Option 1: Using OpenAI API (Recommended if you have a key)
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a cybersecurity expert. Provide concise and helpful answers about cybersecurity topics.'
              },
              {
                role: 'user',
                content: userInput
              }
            ],
            max_tokens: 200,
            temperature: 0.7,
          })
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your REACT_APP_OPENAI_API_KEY');
        }
        if (response.status === 404) {
          throw new Error('API endpoint not found. Check your API configuration.');
        }
        if (response.status === 429) {
          throw new Error('Rate limited. Please wait a moment and try again.');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      const aiText = data.choices?.[0]?.message?.content || 'No response generated';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiText
      }]);

    } catch (error) {
      console.error('Error:', error);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${error.message}`
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
          🤖 Powered by OpenAI | Status:{' '}
          <span className={isDark ? 'text-accent' : 'text-accent-light'}>✅ Ready</span>
        </p>
      </div>

      <div className={`h-96 overflow-y-auto mb-4 p-4 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-gray-50'}`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className={`mb-4 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
              Ask me anything about cybersecurity! 🔐
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'What is SQL injection?', 
                'Explain XSS attacks', 
                'What is penetration testing?', 
                'How does encryption work?',
                'What is a firewall?'
              ].map((question) => (
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
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : isDark ? 'bg-brand text-text' : 'bg-white text-text-light border border-brand-light'
              }`}
            >
              <p className="text-xs font-bold mb-1 opacity-70">
                {msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
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
                <p className={isDark ? 'text-muted' : 'text-muted-light'}>AI is thinking...</p>
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
        💡 Powered by OpenAI - Your API Key Required
      </p>
    </div>
  );
}