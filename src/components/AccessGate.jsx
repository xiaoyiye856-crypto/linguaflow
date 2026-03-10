import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const ACCESS_CODE = 'oz2026';
const STORAGE_KEY = 'gdayenglish_access';

export function useAccess() {
  return localStorage.getItem(STORAGE_KEY) === 'granted';
}

export default function AccessGate({ children }) {
  const [granted, setGranted] = useState(() => localStorage.getItem(STORAGE_KEY) === 'granted');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, 'granted');
      setGranted(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (granted) return children;

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center">
            <Globe className="w-8 h-8 text-[#FFCD00]" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-1">G'day English</h1>
        <p className="text-slate-500 text-sm mb-8">请输入邀请码以继续</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="输入邀请码"
            className={`w-full border-2 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest outline-none transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#00843D]'
            }`}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">邀请码不正确，请重试</p>}
          <button
            type="submit"
            className="w-full bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            进入
          </button>
        </form>
      </div>
    </div>
  );
}