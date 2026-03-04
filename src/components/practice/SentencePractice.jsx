import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SentencePractice({ sentences }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [checked, setChecked] = useState({});

  const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9'\s]/g, '').trim();

  const handleCheck = (id, correct_en) => {
    const userAns = normalize(answers[id] || '');
    // accept if any variant matches
    const variants = correct_en.split('/').map(v => normalize(v.trim()));
    const isCorrect = variants.some(v => userAns === v || v.includes(userAns) || userAns.includes(v.split(' ').slice(0,3).join(' ')));
    setChecked(prev => ({ ...prev, [id]: isCorrect ? 'correct' : 'wrong' }));
  };

  const handleReveal = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setChecked({});
  };

  const total = sentences.length;
  const done = Object.keys(checked).length;
  const correct = Object.values(checked).filter(v => v === 'correct').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-purple-50 rounded-xl px-5 py-3 border border-purple-100">
        <div className="text-sm text-purple-700 font-medium">
          进度: {done}/{total} &nbsp;·&nbsp; 正确: <span className="text-green-600 font-bold">{correct}</span>
        </div>
        <Button size="sm" variant="outline" onClick={handleReset} className="text-purple-700 border-purple-300 hover:bg-purple-100">
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
        </Button>
      </div>

      <div className="divide-y divide-slate-100 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {sentences.map((item, idx) => {
          const status = checked[item.id];
          return (
            <div key={item.id} className={`p-4 md:p-5 transition-colors ${status === 'correct' ? 'bg-green-50' : status === 'wrong' ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 font-mono text-sm w-6 shrink-0 mt-2.5">{idx + 1}</span>
                <div className="flex-1 space-y-3">
                  <div className="font-bold text-slate-900 text-base">{item.chinese}</div>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={answers[item.id] || ''}
                      onChange={e => {
                        setAnswers(prev => ({ ...prev, [item.id]: e.target.value }));
                        setChecked(prev => { const n = {...prev}; delete n[item.id]; return n; });
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleCheck(item.id, item.correct_en)}
                      placeholder="用英文写出地道表达..."
                      className={`flex-1 ${status === 'correct' ? 'border-green-400 bg-green-50' : status === 'wrong' ? 'border-red-400 bg-red-50' : ''}`}
                    />
                    <Button size="sm" onClick={() => handleCheck(item.id, item.correct_en)} className="bg-slate-800 hover:bg-slate-700 text-white shrink-0">
                      确认
                    </Button>
                    <button onClick={() => handleReveal(item.id)} className="text-slate-400 hover:text-slate-700 shrink-0">
                      {revealed[item.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {status === 'correct' && (
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> 答对了！
                    </div>
                  )}
                  {status === 'wrong' && (
                    <div className="flex items-center gap-2 text-red-700 text-sm">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>参考答案: <span className="font-bold text-slate-800">{item.correct_en}</span></span>
                    </div>
                  )}
                  {revealed[item.id] && !status && (
                    <div className="text-sm text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
                      💡 参考答案: <span className="font-bold text-slate-800">{item.correct_en}</span>
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