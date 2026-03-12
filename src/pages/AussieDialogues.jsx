import React, { useState } from 'react';
import { Play, ArrowLeft, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DAILY_CHAT_DIALOGUES = [
  {
    id: 1,
    title: "How's it going?",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Hey, how's it going?", zh: "嘿，你好吗？" },
      { speaker: "B", en: "Yeah, not too bad! You?", zh: "还不错！你呢？" },
      { speaker: "A", en: "Pretty good, just been flat out at work.", zh: "挺好的，只是工作一直很忙。" },
      { speaker: "B", en: "Tell me about it. TGIF though, right?", zh: "我懂你！不过还好今天是周五，对吧？" },
    ],
  },
  {
    id: 2,
    title: "The weather today",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Gorgeous day today, isn't it?", zh: "今天天气真好，不是吗？" },
      { speaker: "B", en: "Absolutely! Perfect beach weather.", zh: "确实！去海滩的好天气。" },
      { speaker: "A", en: "Shame I'm stuck inside the office.", zh: "可惜我被关在办公室里。" },
      { speaker: "B", en: "Ha, same. Roll on the weekend!", zh: "哈，我也是。盼着周末快来！" },
    ],
  },
  {
    id: 3,
    title: "Weekend plans",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Got anything on this weekend?", zh: "这个周末有什么安排吗？" },
      { speaker: "B", en: "Nothing much. Might do a barbie with the neighbours.", zh: "没啥大事。可能跟邻居一起烧烤。" },
      { speaker: "A", en: "Oh nice! Love a good barbie.", zh: "哦，不错！我最喜欢烧烤了。" },
      { speaker: "B", en: "Yeah, should be a ripper.", zh: "是啊，应该会很棒。" },
    ],
  },
  {
    id: 4,
    title: "Morning coffee run",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "I'm heading to grab a coffee. Want one?", zh: "我要去买咖啡，你要吗？" },
      { speaker: "B", en: "Oh yes please! Flat white, no sugar.", zh: "当然要！白咖啡，不加糖。" },
      { speaker: "A", en: "Easy done. The usual place?", zh: "好的。老地方吗？" },
      { speaker: "B", en: "Yeah, their coffee is the best around.", zh: "对，他们家咖啡是附近最好的。" },
    ],
  },
  {
    id: 5,
    title: "Catching up after holidays",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Welcome back! How were the holidays?", zh: "欢迎回来！假期过得怎么样？" },
      { speaker: "B", en: "Brilliant! We went up to Queensland.", zh: "太棒了！我们去了昆士兰。" },
      { speaker: "A", en: "Oh awesome! The weather up there would've been magic.", zh: "哇太好了！那里的天气一定很棒。" },
      { speaker: "B", en: "It was unreal. Didn't want to come back.", zh: "简直不真实。都不想回来了。" },
    ],
  },
  {
    id: 6,
    title: "Did you catch the footy?",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Did you catch the footy last night?", zh: "昨晚看橄榄球了吗？" },
      { speaker: "B", en: "Nah, missed it. Who won?", zh: "没有，错过了。谁赢了？" },
      { speaker: "A", en: "The Hawks! What a game it was.", zh: "老鹰队！真是场精彩的比赛。" },
      { speaker: "B", en: "Oh no way! I can't believe I missed that.", zh: "不是吧！真不敢相信我错过了。" },
    ],
  },
  {
    id: 7,
    title: "Running into a neighbour",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Hey! Haven't seen you in ages.", zh: "嘿！好久不见。" },
      { speaker: "B", en: "I know, right! Been flat out lately.", zh: "是啊！最近一直很忙。" },
      { speaker: "A", en: "How's the family going?", zh: "你家人都好吗？" },
      { speaker: "B", en: "All good, thanks! Kids are keeping us busy.", zh: "都好，谢谢！孩子们让我们忙个不停。" },
    ],
  },
  {
    id: 8,
    title: "Where to for lunch?",
    topic: "日常闲聊",
    lines: [
      { speaker: "A", en: "Where are you thinking for lunch?", zh: "你打算去哪里吃午饭？" },
      { speaker: "B", en: "Not sure yet. Maybe that new Thai place?", zh: "还不确定。也许去那家新开的泰国餐厅？" },
      { speaker: "A", en: "Ooh yeah, I've heard it's really good.", zh: "哦是的，我听说很不错。" },
      { speaker: "B", en: "Let's give it a go then!", zh: "那我们就去试试吧！" },
    ],
  },
];

function DialogueCard({ dialogue, onBack }) {
  const speakLine = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-AU';
      utt.rate = 0.9;
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-600">
        <ArrowLeft className="w-4 h-4" /> 返回列表
      </Button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{dialogue.title}</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mb-6 inline-block">
          {dialogue.topic}
        </span>
        <div className="space-y-4 mt-4">
          {dialogue.lines.map((line, idx) => (
            <div key={idx} className={`flex gap-3 ${line.speaker === 'B' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${line.speaker === 'A' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {line.speaker}
              </div>
              <div className={`max-w-xs rounded-2xl px-4 py-3 ${line.speaker === 'A' ? 'bg-blue-50 rounded-tl-sm' : 'bg-green-50 rounded-tr-sm'}`}>
                <p className="text-gray-800 font-medium text-sm">{line.en}</p>
                <p className="text-gray-500 text-xs mt-1">{line.zh}</p>
                <button onClick={() => speakLine(line.en)} className="mt-2 text-gray-400 hover:text-blue-500 transition-colors" title="朗读">
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AussieDialogues() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <DialogueCard dialogue={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Aussie Small Talk 🗣️</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          直击澳洲生活的 Small Talk 对话，助你轻松破冰、拓展人脉，拒绝社交尴尬！
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💬</div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">日常闲聊</h2>
            <p className="text-sm text-gray-500">{DAILY_CHAT_DIALOGUES.length} 个对话</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DAILY_CHAT_DIALOGUES.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{d.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{d.lines.length} 句对话</p>
                </div>
                <Play className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
              </div>
              <p className="text-xs text-gray-500 mt-3 italic line-clamp-1">"{d.lines[0].en}"</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
