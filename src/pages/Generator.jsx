import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Sparkles, Save, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function Generator() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const isEditing = !!id;

  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [textMode, setTextMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [article, setArticle] = useState({
    title: '', source_url: '', reference_url: '', image_url: '',
    paragraphs: [], vocabulary: [], expressions: [],
    extensions: { speaking: '', writing: '', culture: '' }
  });

  const { data: existingArticle } = useQuery({
    queryKey: ['article', id],
    queryFn: () => base44.entities.Article.get(id),
    enabled: isEditing
  });

  useEffect(() => {
    if (existingArticle) {
      setArticle(existingArticle);
      setUrl(existingArticle.source_url || '');
    }
  }, [existingArticle]);

  const generate = async () => {
    if (!textMode && !url) return;
    if (textMode && !rawText) return;
    
    setIsLoading(true);
    try {
      const instructions = `
        Keep it concise, around 300-400 words (about 3-5 minutes reading time max).
        Provide a good title. Find an appropriate image URL if possible, otherwise leave empty.
        Break the article into 5-8 short paragraphs for easy reading.
        For each paragraph, provide the original English text ('en') and a natural, professional Chinese translation ('zh').
        Extract 5-8 core vocabulary words from the text. For each, provide the word, phonetic symbol (e.g. /tɛst/), part of speech (e.g. n., v., adj.), and Chinese meaning.
        Extract 2-3 useful English expressions, phrases, or idioms from the text. For each, provide the phrase, Chinese meaning, and an English example sentence.
        ALSO, provide 3 extension points (write these in Chinese):
        1. 'speaking': How to use related concepts in oral English (口语表达拓展). Give specific tips and examples.
        2. 'writing': How to use related advanced structures in writing (写作表达拓展). Give specific tips and examples.
        3. 'culture': Related cultural background or context (文化拓展).
      `;

      const prompt = textMode 
        ? `Here is an English article text:\n\n${rawText}\n\n${instructions}`
        : `Extract the main article from this URL: ${url}. \n${instructions}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: !textMode,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            image_url: { type: "string" },
            paragraphs: {
              type: "array",
              items: {
                type: "object",
                properties: { en: { type: "string" }, zh: { type: "string" } }
              }
            },
            vocabulary: {
              type: "array",
              items: {
                type: "object",
                properties: { word: { type: "string" }, phonetic: { type: "string" }, part_of_speech: { type: "string" }, meaning: { type: "string" } }
              }
            },
            expressions: {
              type: "array",
              items: {
                type: "object",
                properties: { phrase: { type: "string" }, meaning: { type: "string" }, example: { type: "string" } }
              }
            },
            extensions: {
              type: "object",
              properties: {
                speaking: { type: "string" },
                writing: { type: "string" },
                culture: { type: "string" }
              }
            }
          }
        }
      });
      
      setArticle(prev => ({
        ...prev,
        ...response,
        source_url: textMode ? '' : url
      }));
    } catch (e) {
      console.error(e);
      alert(`Failed to generate article: ${e.message || e.toString()}\n\nNote: If using a URL, the site might have anti-bot protection. Try pasting the text instead!`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await base44.entities.Article.update(id, article);
        navigate(`${createPageUrl('ArticleView')}?id=${id}`);
      } else {
        const saved = await base44.entities.Article.create(article);
        navigate(`${createPageUrl('ArticleView')}?id=${saved.id}`);
      }
    } catch (e) {
      alert("Failed to save article");
    }
  };

  const updateField = (field, value) => setArticle(p => ({...p, [field]: value}));
  const updateExtension = (field, value) => setArticle(p => ({
    ...p, 
    extensions: { ...(p.extensions || {}), [field]: value }
  }));
  
  const updateArray = (arrayName, index, field, value) => {
    setArticle(p => {
      const arr = [...(p[arrayName] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...p, [arrayName]: arr };
    });
  };

  const addArrayItem = (arrayName, defaultObj) => {
    setArticle(p => ({ ...p, [arrayName]: [...(p[arrayName] || []), defaultObj] }));
  };

  const removeArrayItem = (arrayName, index) => {
    setArticle(p => ({ ...p, [arrayName]: p[arrayName].filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      <Link to={createPageUrl('Home')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isEditing ? 'Edit Study Material' : 'Import New Article'}
        </h1>
        <p className="text-slate-500 mb-6">
          {isEditing 
            ? 'Review and modify the extracted content, translations, and vocabulary before finalizing.' 
            : 'Paste a URL from Real Simple (or other publications) to automatically generate bilingual reading materials, vocabulary, and audio.'}
        </p>

        {!isEditing && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant={!textMode ? "default" : "outline"} 
                onClick={() => setTextMode(false)}
                className={!textMode ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                From URL
              </Button>
              <Button 
                variant={textMode ? "default" : "outline"} 
                onClick={() => setTextMode(true)}
                className={textMode ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Paste Text
              </Button>
            </div>
            
            <div className="flex gap-4 items-start">
              {!textMode ? (
                <Input 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  placeholder="https://www.realsimple.com/..." 
                  className="flex-1 text-lg py-6"
                />
              ) : (
                <Textarea 
                  value={rawText} 
                  onChange={e => setRawText(e.target.value)} 
                  placeholder="Paste your article text here..." 
                  className="flex-1 min-h-[150px] text-lg"
                />
              )}
              <Button onClick={generate} disabled={isLoading || (!textMode && !url) || (textMode && !rawText)} className="bg-blue-600 hover:bg-blue-700 min-w-[160px] h-auto text-lg py-6">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Generate
              </Button>
            </div>
          </div>
        )}
      </div>

      {(article.title || isEditing) && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-12">
          
          {/* Metadata Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-800 border-b pb-2">1. Article Metadata</h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <Input value={article.title || ''} onChange={e => updateField('title', e.target.value)} className="text-lg font-serif" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image URL</label>
                <Input value={article.image_url || ''} onChange={e => updateField('image_url', e.target.value)} />
                {article.image_url && (
                  <img src={article.image_url} alt="Preview" className="mt-3 h-32 rounded-lg object-cover shadow-sm" />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Source URL</label>
                  <Input value={article.source_url || ''} onChange={e => updateField('source_url', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">External Reference URL (Optional)</label>
                  <Input value={article.reference_url || ''} onChange={e => updateField('reference_url', e.target.value)} placeholder="Link to related video/material" />
                </div>
              </div>
            </div>
          </div>

          {/* Paragraphs Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-serif font-bold text-slate-800">2. Bilingual Paragraphs</h2>
              <Button size="sm" variant="outline" onClick={() => addArrayItem('paragraphs', {en:'', zh:''})}>
                <Plus className="w-4 h-4 mr-1" /> Add Paragraph
              </Button>
            </div>
            <div className="space-y-4">
              {article.paragraphs?.map((p, i) => (
                <div key={i} className="p-5 border border-slate-200 rounded-xl relative group bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {i + 1}
                  </div>
                  <Button size="icon" variant="ghost" className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50" onClick={() => removeArrayItem('paragraphs', i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">English</label>
                      <Textarea value={p.en} onChange={e => updateArray('paragraphs', i, 'en', e.target.value)} className="min-h-[100px] font-serif text-lg leading-relaxed resize-y" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 block">Chinese Translation</label>
                      <Textarea value={p.zh} onChange={e => updateArray('paragraphs', i, 'zh', e.target.value)} className="min-h-[80px] text-base leading-relaxed resize-y" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vocabulary Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-serif font-bold text-slate-800">3. Core Vocabulary</h2>
              <Button size="sm" variant="outline" onClick={() => addArrayItem('vocabulary', {word:'', phonetic:'', part_of_speech:'', meaning:''})}>
                <Plus className="w-4 h-4 mr-1" /> Add Word
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {article.vocabulary?.map((v, i) => (
                <div key={i} className="p-5 border border-slate-200 rounded-xl relative group bg-[#f8fafc]">
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 h-8 w-8 rounded-full" onClick={() => removeArrayItem('vocabulary', i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Word</label>
                      <Input value={v.word} onChange={e => updateArray('vocabulary', i, 'word', e.target.value)} className="font-bold" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Phonetic</label>
                      <Input value={v.phonetic} onChange={e => updateArray('vocabulary', i, 'phonetic', e.target.value)} className="font-mono text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Part of Speech</label>
                      <Input value={v.part_of_speech} onChange={e => updateArray('vocabulary', i, 'part_of_speech', e.target.value)} placeholder="e.g. n., v." />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Meaning</label>
                      <Input value={v.meaning} onChange={e => updateArray('vocabulary', i, 'meaning', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expressions Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-serif font-bold text-slate-800">4. Key Expressions</h2>
              <Button size="sm" variant="outline" onClick={() => addArrayItem('expressions', {phrase:'', meaning:'', example:''})}>
                <Plus className="w-4 h-4 mr-1" /> Add Expression
              </Button>
            </div>
            <div className="space-y-4">
              {article.expressions?.map((exp, i) => (
                <div key={i} className="p-5 border border-slate-200 rounded-xl relative group bg-amber-50/30">
                  <Button size="icon" variant="ghost" className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 h-8 w-8 rounded-full" onClick={() => removeArrayItem('expressions', i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Phrase / Idiom</label>
                      <Input value={exp.phrase} onChange={e => updateArray('expressions', i, 'phrase', e.target.value)} className="font-bold text-amber-900" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Chinese Meaning</label>
                      <Input value={exp.meaning} onChange={e => updateArray('expressions', i, 'meaning', e.target.value)} />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block">Example Sentence</label>
                      <Textarea value={exp.example} onChange={e => updateArray('expressions', i, 'example', e.target.value)} className="font-serif italic text-slate-700 min-h-[60px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extensions Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-800 border-b pb-2">5. Knowledge Extensions</h2>
            <div className="grid gap-6">
              <div className="p-5 border border-slate-200 rounded-xl bg-purple-50/30">
                <label className="block text-sm font-bold text-purple-800 mb-2">Speaking Extension (口语表达拓展)</label>
                <Textarea 
                  value={article.extensions?.speaking || ''} 
                  onChange={e => updateExtension('speaking', e.target.value)} 
                  className="min-h-[100px] text-base leading-relaxed resize-y" 
                  placeholder="Specific tips and examples for using these concepts in oral English..."
                />
              </div>
              <div className="p-5 border border-slate-200 rounded-xl bg-blue-50/30">
                <label className="block text-sm font-bold text-blue-800 mb-2">Writing Extension (写作表达拓展)</label>
                <Textarea 
                  value={article.extensions?.writing || ''} 
                  onChange={e => updateExtension('writing', e.target.value)} 
                  className="min-h-[100px] text-base leading-relaxed resize-y" 
                  placeholder="Advanced structures and vocabulary for formal writing..."
                />
              </div>
              <div className="p-5 border border-slate-200 rounded-xl bg-emerald-50/30">
                <label className="block text-sm font-bold text-emerald-800 mb-2">Cultural Context (文化拓展)</label>
                <Textarea 
                  value={article.extensions?.culture || ''} 
                  onChange={e => updateExtension('culture', e.target.value)} 
                  className="min-h-[100px] text-base leading-relaxed resize-y" 
                  placeholder="Related cultural background, history, or context..."
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-8 pt-6 border-t flex justify-end bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border">
            <Button size="lg" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-full shadow-lg shadow-green-200">
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? 'Save All Changes' : 'Finalize & Publish Article'}
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}