import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 50),
    initialData: []
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Reading List</h1>
          <p className="text-slate-500">Master English with carefully curated articles, bilingual translations, and natural audio.</p>
        </div>
        <Link to={createPageUrl('Generator')}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            <PlusCircle className="w-5 h-5 mr-2" />
            Import New Article
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(article => (
            <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group flex flex-col hover:-translate-y-1">
              {article.image_url ? (
                <div className="h-48 overflow-hidden">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : (
                <div className="h-48 bg-slate-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-slate-300" />
                </div>
              )}
              <CardHeader className="flex-1">
                <CardTitle className="line-clamp-2 leading-snug text-lg font-bold">{article.title}</CardTitle>
                <div className="flex items-center text-xs text-slate-400 mt-3 gap-2 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(article.created_date), 'MMM d, yyyy')}
                </div>
              </CardHeader>
              <CardFooter className="pt-4 pb-4 border-t border-slate-50">
                <Link to={`${createPageUrl('ArticleView')}?id=${article.id}`} className="w-full">
                  <Button variant="ghost" className="w-full justify-between hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold transition-colors">
                    Read & Listen <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          {articles.length === 0 && (
            <div className="col-span-full text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No articles yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start by importing a Real Simple article or any English content to generate a study guide.</p>
              <Link to={createPageUrl('Generator')}>
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Import First Article
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}