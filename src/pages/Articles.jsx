import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, ArrowRight } from 'lucide-react';

const TITLE_ZH = {
  'The Art of Greeting in Australia': '澳洲问候的艺术',
  'Understanding Australian Communication Styles': '了解澳洲沟通方式',
  'Understanding Australian Culture': '了解澳洲文化',
  "Australia Culture:Helpful Do's and Don'ts": '澳洲文化：行为守则',
  'Navigating Etiquette in Australia: A Friendly Guide': '澳洲礼仪指南',
  'Multiculturalism and Identity in Australia': '澳洲的多元文化与身份认同',
  "Understanding Australia's Indigenous Heritage": '了解澳洲原住民文化遗产',
  'The Evolution of Family in Australia': '澳洲家庭结构的演变',
};

export default function Articles() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list('sort_order'),
    initialData: []
  });

  const sortedArticles = [...articles].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-amber-600" />
          英语文章—澳洲文化
        </h1>
        <p className="text-lg text-slate-500">精选文章，深入了解澳洲文化与生活方式，配套双语阅读与词汇讲解</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500">加载中...</div>
      ) : sortedArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">暂无文章</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArticles.map((article) => (
            <Link key={article.id} to={`${createPageUrl('ArticleView')}?id=${article.id}`} className="block group">
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                  {article.image_url ? (
                    <img src={article.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-50">
                      <BookOpen className="w-12 h-12 opacity-50 text-amber-400" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  {TITLE_ZH[article.title] && (
                    <p className="text-sm text-slate-500 mb-3">{TITLE_ZH[article.title]}</p>
                  )}
                  <div className="mt-auto flex items-center text-amber-600 font-bold text-sm bg-amber-50 w-fit px-3 py-1.5 rounded-full">
                    阅读文章 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}