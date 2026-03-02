import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Newspaper, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Articles() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list('-created_date'),
    initialData: []
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <Newspaper className="w-10 h-10 text-blue-600" />
            澳洲杂志期刊
          </h1>
          <p className="text-lg text-slate-500">精选澳洲时报阅读，自动化翻译与核心词汇提取</p>
        </div>
        <Link to={createPageUrl('Generator')}>
          <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-6 h-12 rounded-xl text-lg shadow-md shadow-blue-200">
            <Plus className="w-5 h-5 mr-2" /> 导入新文章
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">暂无文章</h3>
          <p className="text-slate-500 mb-6">点击右上角导入第一篇澳洲杂志期刊吧！</p>
          <Link to={createPageUrl('Generator')}>
            <Button>去导入文章</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link key={article.id} to={`${createPageUrl('ArticleView')}?id=${article.id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                  {article.image_url ? (
                    <img src={article.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <Newspaper className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                    {new Date(article.created_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center text-blue-600 font-bold text-sm bg-blue-50 w-fit px-3 py-1.5 rounded-full">
                    Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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