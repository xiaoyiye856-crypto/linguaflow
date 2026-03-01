import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Home, PlusCircle } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-[#1e293b] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to={createPageUrl('Home')} className="flex items-center gap-2 font-bold text-xl tracking-wider">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span>NovaLingo</span>
              </Link>
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link to={createPageUrl('Home')} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to={createPageUrl('Generator')} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                  <PlusCircle className="w-4 h-4" /> Import Article
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}