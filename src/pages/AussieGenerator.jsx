import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Save, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function AussieGenerator() {
  const [mode, setMode] = useState('sentence'); // sentence, dialogue, vocab
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const generate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setGeneratedData(null);
    try {
      let prompt = '';
      let schema = {};

      if (mode === 'sentence') {
        prompt = `Generate 5 common Australian English daily mistakes based on the topic/text: "${topic}". For each, provide the Chinese meaning, the typical incorrect English (wrong_en), the correct authentic Aussie English (correct_en), and a brief explanation in Chinese.`;
        schema = {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  chinese: { type: "string" },
                  wrong_en: { type: "string" },
                  correct_en: { type: "string" },
                  explanation: { type: "string" },
                  category: { type: "string" }
                }
              }
            }
          }
        };
      } else if (mode === 'dialogue') {
        prompt = `Generate 1 common Australian English small talk dialogue based on the topic/text: "${topic}". Provide a title, context, and a conversation between 2 people (at least 6 lines). For each line, provide the speaker name, English text (with Aussie slang/tone), and Chinese translation.`;
        schema = {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  context: { type: "string" },
                  lines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        speaker: { type: "string" },
                        en: { type: "string" },
                        zh: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        };
      } else {
        prompt = `Generate 5 common Australian English vocabulary words/slang based on the topic/text: "${topic}". For each, provide the word, phonetic symbol, part of speech, Chinese meaning, an authentic Aussie English example sentence, and its Chinese translation.`;
        schema = {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  word: { type: "string" },
                  phonetic: { type: "string" },
                  part_of_speech: { type: "string" },
                  chinese: { type: "string" },
                  example_en: { type: "string" },
                  example_zh: { type: "string" }
                }
              }
            }
          }
        };
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: schema
      });
      
      setGeneratedData(response.items);
    } catch (e) {
      alert("Generation failed: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    if (!generatedData) return;
    try {
      if (mode === 'sentence') {
        await base44.entities.AussieSentence.bulkCreate(generatedData);
      } else if (mode === 'dialogue') {
        await base44.entities.AussieDialogue.bulkCreate(generatedData);
      } else {
        await base44.entities.AussieVocabulary.bulkCreate(generatedData);
      }
      alert("Successfully saved to database!");
      setGeneratedData(null);
      setTopic('');
    } catch (e) {
      alert("Failed to save: " + e.message);
    }
  };

  const updateItem = (index, field, value) => {
    const newData = [...generatedData];
    newData[index][field] = value;
    setGeneratedData(newData);
  };

  const updateLine = (itemIndex, lineIndex, field, value) => {
    const newData = [...generatedData];
    newData[itemIndex].lines[lineIndex][field] = value;
    setGeneratedData(newData);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in">
      <Link to={createPageUrl('Home')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Aussie Content Generator 🪄</h1>
        <p className="text-slate-500 mb-6">
          Paste text or enter a topic to automatically generate authentic Australian English materials. You can edit before saving.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            variant={mode === 'sentence' ? "default" : "outline"} 
            onClick={() => setMode('sentence')}
            className={mode === 'sentence' ? "bg-[#00843D] hover:bg-[#00843D]/90" : ""}
          >
            易错口语 (Sentences)
          </Button>
          <Button 
            variant={mode === 'dialogue' ? "default" : "outline"} 
            onClick={() => setMode('dialogue')}
            className={mode === 'dialogue' ? "bg-[#00843D] hover:bg-[#00843D]/90" : ""}
          >
            情景对话 (Dialogues)
          </Button>
          <Button 
            variant={mode === 'vocab' ? "default" : "outline"} 
            onClick={() => setMode('vocab')}
            className={mode === 'vocab' ? "bg-[#00843D] hover:bg-[#00843D]/90" : ""}
          >
            核心词汇 (Vocabulary)
          </Button>
        </div>
        
        <div className="flex gap-4 items-start">
          <Textarea 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            placeholder="Paste your article text here, or enter a topic like 'Buying beer at a pub'..." 
            className="flex-1 min-h-[150px] text-lg"
          />
          <Button onClick={generate} disabled={isLoading || !topic} className="bg-[#FFCD00] hover:bg-[#e6b800] text-slate-900 min-w-[160px] h-auto text-lg py-6 shadow-md">
            {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Generate
          </Button>
        </div>
      </div>

      {generatedData && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">Preview & Edit Data</h2>
            <Button onClick={save} className="bg-[#00843D] hover:bg-[#00843D]/90 shadow-md">
              <Save className="w-4 h-4 mr-2" /> Save to Database
            </Button>
          </div>

          <div className="space-y-6">
            {generatedData.map((item, idx) => (
              <div key={idx} className="p-6 bg-slate-50/50 rounded-xl border border-slate-200 space-y-4">
                {mode === 'sentence' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">Category</label><Input value={item.category || ''} onChange={e => updateItem(idx, 'category', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">中文 (Chinese)</label><Input value={item.chinese || ''} onChange={e => updateItem(idx, 'chinese', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">你以为的 (Wrong EN)</label><Input value={item.wrong_en || ''} onChange={e => updateItem(idx, 'wrong_en', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">地道表达 (Correct EN)</label><Input value={item.correct_en || ''} onChange={e => updateItem(idx, 'correct_en', e.target.value)} className="font-bold text-[#00843D]" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 mb-1 block">解释 (Explanation)</label><Input value={item.explanation || ''} onChange={e => updateItem(idx, 'explanation', e.target.value)} /></div>
                  </div>
                )}

                {mode === 'dialogue' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-slate-500 mb-1 block">Title</label><Input value={item.title || ''} onChange={e => updateItem(idx, 'title', e.target.value)} className="font-bold" /></div>
                      <div><label className="text-xs font-bold text-slate-500 mb-1 block">Context</label><Input value={item.context || ''} onChange={e => updateItem(idx, 'context', e.target.value)} /></div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-slate-500 block">Lines</label>
                      {item.lines?.map((line, lIdx) => (
                        <div key={lIdx} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-slate-100">
                          <Input className="w-24 font-bold uppercase text-xs" value={line.speaker || ''} onChange={e => updateLine(idx, lIdx, 'speaker', e.target.value)} placeholder="Speaker" />
                          <div className="flex-1 space-y-2">
                            <Input value={line.en || ''} onChange={e => updateLine(idx, lIdx, 'en', e.target.value)} placeholder="English" className="font-medium" />
                            <Input value={line.zh || ''} onChange={e => updateLine(idx, lIdx, 'zh', e.target.value)} placeholder="Chinese" className="text-sm text-slate-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mode === 'vocab' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 md:col-span-2">
                      <div className="flex-1"><label className="text-xs font-bold text-slate-500 mb-1 block">Word</label><Input value={item.word || ''} onChange={e => updateItem(idx, 'word', e.target.value)} className="font-bold text-lg" /></div>
                      <div className="w-32"><label className="text-xs font-bold text-slate-500 mb-1 block">Phonetic</label><Input value={item.phonetic || ''} onChange={e => updateItem(idx, 'phonetic', e.target.value)} className="font-mono text-sm" /></div>
                      <div className="w-32"><label className="text-xs font-bold text-slate-500 mb-1 block">Part of Speech</label><Input value={item.part_of_speech || ''} onChange={e => updateItem(idx, 'part_of_speech', e.target.value)} /></div>
                    </div>
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">Chinese</label><Input value={item.chinese || ''} onChange={e => updateItem(idx, 'chinese', e.target.value)} /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 mb-1 block">Example EN</label><Input value={item.example_en || ''} onChange={e => updateItem(idx, 'example_en', e.target.value)} className="italic" /></div>
                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 mb-1 block">Example ZH</label><Input value={item.example_zh || ''} onChange={e => updateItem(idx, 'example_zh', e.target.value)} /></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}