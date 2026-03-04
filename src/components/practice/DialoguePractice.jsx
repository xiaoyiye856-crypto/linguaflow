import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, EyeOff, RotateCcw, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function DialoguePractice({ dialogue }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [checked, setChecked] = useState({});

  const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9'\s]/g, '').trim();

  const handleCheck = (idx, correct) => {
    const userAns = normalize(answers[idx] || '');
    const ref = normalize(correct);
    // fuzzy: user typed at least 70% of words correctly
    const refWords = ref.split(' ').filter(Boolean);
    const userWords = userAns.split(' ').filter(Boolean);
    const matched = refWords.filter(w => userWords.includes(w)).length;
    const isCorrect = matched / refWords.length >= 0.7;
    setChecked(prev => ({ ...prev, [idx]: isCorrect ? 'correct' : 'wrong' }));
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setChecked({});
  };

  const lines = dialogue.lines || [];
  const total = lines.length;
  const done = Object.keys(checked).length;
  const correct = Object.values(checked).filter(v => v === 'correct').length;

  return (
    <div className="border-t border-purple-100 bg-purple-50/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-purple-800 flex items-center gap-2 text-sm">
          <PenLine className="w-4 h-4" /> 看中文，写出英文对话
        </h4>
        <div className="flex items-center gap-3">
          <span className="text-xs text-purple-600">{done}/{total} · 正确 {correct}</span>
          <Button size="sm" variant="outline" onClick={handleReset} className="text-purple-700 border-purple-300 hover:bg-purple-100 h-7 text-xs">
            <RotateCcw className="w-3 h-3 mr-1" /> 重置
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {lines.map((line, idx) => {
          const status = checked[idx];
          return (
            <div key={idx} className={`rounded-xl p-4 border transition-colors ${status === 'correct' ? 'bg-green-50 border-green-200' : status === 'wrong' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="flex gap-3 items-start">
                <span className={`font-bold text-xs uppercase tracking-wider shrink-0 mt-1 w-14 text-right ${line.gender === 'female' ? 'text-pink-600' : line.gender === 'male' ? 'text-blue-600' : 'text-slate-500'}`}>
                  {line.speaker}
                </span>
                <div className="flex-1 space-y-2">
                  <div className="text-slate-700 font-medium text-sm">{line.zh}</div>
                  <Textarea
                    rows={2}
                    value={answers[idx] || ''}
                    onChange={e => {
                      setAnswers(prev => ({ ...prev, [idx]: e.target.value }));
                      setChecked(prev => { const n = {...prev}; delete n[idx]; return n; });
                    }}
                    placeholder="用英文写出这句话..."
                    className={`text-sm resize-none ${status === 'correct' ? 'border-green-300' : status === 'wrong' ? 'border-red-300' : ''}`}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleCheck(idx, line.en)} className="bg-purple-700 hover:bg-purple-800 text-white h-7 text-xs">
                      确认
                    </Button>
                    <button onClick={() => setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }))} className="text-slate-400 hover:text-slate-600">
                      {revealed[idx] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {status === 'correct' && <span className="flex items-center gap-1 text-green-700 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" />答对了！</span>}
                    {status === 'wrong' && <span className="flex items-center gap-1 text-red-700 text-xs"><XCircle className="w-3.5 h-3.5 shrink-0" />参考: <span className="font-bold text-slate-800 ml-1">{line.en}</span></span>}
                  </div>
                  {revealed[idx] && !status && (
                    <div className="text-xs text-slate-500 bg-slate-100 rounded px-2 py-1">
                      💡 {line.en}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}