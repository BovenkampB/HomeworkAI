'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, SCHOOL_LEVEL_LABELS } from '@/types/profile';
import { getProfile } from '@/lib/profile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentSubject, setCurrentSubject] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/setup');
      return;
    }
    setProfile(p);
    setCurrentSubject(p.subjects[0] ?? '');
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isStreaming || !profile) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, profile, currentSubject }),
      });

      if (!res.ok || !res.body) throw new Error('API error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const { text } = JSON.parse(data) as { text: string };
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: updated[updated.length - 1].content + text,
              };
              return updated;
            });
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Er ging iets mis. Probeer het opnieuw.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function changeSubject(subject: string) {
    setCurrentSubject(subject);
    setMessages([]);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-400 text-sm">Laden...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-tight">HomeworkAI</p>
          <p className="text-xs text-gray-500 truncate">
            {profile.name} · {SCHOOL_LEVEL_LABELS[profile.schoolLevel]} jaar {profile.schoolYear}
          </p>
        </div>

        <select
          value={currentSubject}
          onChange={e => changeSubject(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          {profile.subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={() => setMessages([])}
          title="Nieuw gesprek"
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          Nieuw gesprek
        </button>

        <button
          onClick={() => router.push('/setup')}
          title="Profiel bewerken"
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Profiel
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Klaar om {currentSubject} te oefenen?
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                Stel een vraag of geef een opgave in. Ik help je er doorheen — zonder het antwoord te verklappen!
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}
              >
                {msg.content ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <span className="inline-block w-2 h-4 bg-gray-300 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Stel een vraag over ${currentSubject}…`}
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 overflow-auto"
            style={{ maxHeight: '8rem' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="bg-indigo-600 text-white rounded-xl px-4 py-3 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shrink-0"
          >
            Stuur
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter om te sturen · Shift+Enter voor nieuwe regel
        </p>
      </footer>
    </div>
  );
}
