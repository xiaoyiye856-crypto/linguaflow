import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, BookOpen, ArrowRight, GripVertical, Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Articles() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list('sort_order'),
    initialData: []
  });

  const sortedArticles = [...articles].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  const enterEdit = () => {
    const o = {};
    sortedArticles.forEach((a, i) => { o[a.id] = a.sort_order ?? i; });
    setOrders(o);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = articles
        .filter(a => orders[a.id] !== undefined && Number(orders[a.id]) !== a.sort_order)
        .map(a => base44.entities.Article.update(a.id, { sort_order: Number(orders[a.id]) }));
      if (updates.length > 0) await Promise.all(updates);
      await refetch();
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm('确定要删除这篇文章吗？')) return;
    await base44.entities.Article.delete(id);
    await refetch();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-amber-600" />
            了解澳洲文化
          </h1>
          <p className="text-lg text-slate-500">精选文章，深入了解澳洲文化与生活方式，配套双语阅读与词汇讲解</p>
        </div>
        <div className="flex gap-2 items-center">
          {isAdmin && !isEditing && (
            <Button variant="outline" onClick={enterEdit} className="gap-2 border-slate-300">
              <Edit className="w-4 h-4" /> 编辑排序/删除
            </Button>
          )}
          {isAdmin && isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                <X className="w-4 h-4" /> 取消
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 gap-2">
                {isSaving ? '保存中...' : <><Save className="w-4 h-4" /> 保存排序</>}
              </Button>
            </>
          )}
          <Link to={createPageUrl('Generator')}>
            <Button className="bg-amber-600 hover:bg-amber-700 font-bold px-6 h-12 rounded-xl text-lg shadow-md shadow-amber-200">
              <Plus className="w-5 h-5 mr-2" /> 导入新文章
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500">加载中...</div>
      ) : sortedArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">暂无文章</h3>
          <p className="text-slate-500 mb-6">点击右上角导入第一篇文章吧！</p>
          <Link to={createPageUrl('Generator')}>
            <Button>去导入文章</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArticles.map((article, idx) => (
            <div key={article.id} className="relative group">
              {isEditing && (
                <div className="absolute top-2 right-2 z-10 flex gap-1.5">
                  <input
                    type="number"
                    value={orders[article.id] ?? ''}
                    onChange={e => setOrders(prev => ({ ...prev, [article.id]: e.target.value }))}
                    className="w-14 text-center text-sm font-mono border border-slate-300 rounded-lg bg-white shadow px-1 py-1"
                    placeholder="顺序"
                    onClick={e => e.preventDefault()}
                  />
                  <button
                    onClick={(e) => handleDelete(article.id, e)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 shadow transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <Link to={`${createPageUrl('ArticleView')}?id=${article.id}`} className={`block ${isEditing ? 'pointer-events-none' : ''}`}>
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    {article.image_url ? (
                      <img src={article.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-amber-50">
                        <BookOpen className="w-12 h-12 opacity-50 text-amber-400" />
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <GripVertical className="w-8 h-8 text-white/70" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <div className="mt-auto flex items-center text-amber-600 font-bold text-sm bg-amber-50 w-fit px-3 py-1.5 rounded-full">
                      阅读文章 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}