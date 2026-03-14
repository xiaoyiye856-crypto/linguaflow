import React, { useState } from 'react';
import { Play, ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DIALOGUES = [
  {
    id: 1,
    title: "谈天气 / Talking About the Weather",
    emoji: "☀️",
    lines: [
      { speaker: "A", en: "Lovely day today, isn't it?", zh: "今天天气真好，不是吗？" },
      { speaker: "B", en: "Yeah, absolutely beautiful! A bit warm though.", zh: "是啊，真的很棒！不过有点热。" },
      { speaker: "A", en: "I know, it's been really hot lately. What's the forecast for tomorrow?", zh: "我知道，最近确实很热。明天天气预报怎么说？" },
      { speaker: "B", en: "I heard it might hit 38 degrees. Better stay indoors!", zh: "我听说可能会到38度。最好待在室内！" },
      { speaker: "A", en: "Oh wow, that's scorching. Are you used to the Aussie heat yet?", zh: "哦天啊，真的很炎热。你适应澳洲的热天了吗？" },
      { speaker: "B", en: "Not really, to be honest. Back home it never gets this hot.", zh: "老实说还没完全适应。在我老家从来没这么热过。" },
      { speaker: "A", en: "Where are you from originally?", zh: "你原来是哪里人？" },
      { speaker: "B", en: "I'm from Canada. The weather there is completely different.", zh: "我来自加拿大。那里的天气完全不同。" },
      { speaker: "A", en: "I bet! Well, you'll get used to it eventually. Just keep hydrated.", zh: "我敢打赌！好吧，你最终会习惯的。记得多喝水。" },
      { speaker: "B", en: "Thanks for the tip! I always carry a water bottle now.", zh: "谢谢建议！我现在总是带着水壶。" },
      { speaker: "A", en: "Smart move. The sun here can be really harsh.", zh: "很聪明。这里的太阳真的很强烈。" },
    ],
    keyphrases: [
      { en: "Lovely day today, isn't it?", zh: "今天天气真好，不是吗？（打招呼的常用开场白）" },
      { en: "hit 38 degrees", zh: '气温达到38度（澳洲用"hit"表示温度"达到"）' },
      { en: "scorching", zh: "酷热的、灼热的（比 hot 更强烈）" },
      { en: "Keep hydrated", zh: "保持补水、多喝水（澳洲人的口头禅）" },
      { en: "Stay indoors", zh: "待在室内（热天常见建议）" },
    ],
    aussiePhrases: [
      { en: "Aussie heat", zh: "澳洲特有的高温天气" },
      { en: "Back home", zh: "在老家/家乡（移民常用表达）" },
      { en: "The sun here can be really harsh", zh: "这里的太阳真的很猛烈（提醒防晒）" },
    ],
  },
  {
    id: 2,
    title: "周末计划 / Weekend Plans",
    emoji: "🏖️",
    lines: [
      { speaker: "A", en: "So, any plans for the weekend?", zh: "那么，周末有什么计划？" },
      { speaker: "B", en: "Yeah, I'm thinking of heading to Bondi Beach.", zh: "是的，我打算去邦迪海滩。" },
      { speaker: "A", en: "Oh nice! The weather should be perfect for it.", zh: "哦，太好了！天气应该很适合。" },
      { speaker: "B", en: "Hopefully! Do you ever go to the beach on weekends?", zh: "希望如此！你周末会去海滩吗？" },
      { speaker: "A", en: "Sometimes. Usually I prefer a quiet hike in the bush.", zh: "有时候。通常我更喜欢在丛林里悠闲地徒步。" },
      { speaker: "B", en: "Oh, that sounds relaxing. Where do you usually go?", zh: "哦，听起来很放松。你通常去哪里？" },
      { speaker: "A", en: "There's a great trail near the Blue Mountains. Absolutely stunning views.", zh: "蓝山附近有一条很棒的步道。景色绝对令人叹为观止。" },
      { speaker: "B", en: "I've heard of that! I've been meaning to check it out.", zh: "我听说过那个地方！我一直想去看看。" },
      { speaker: "A", en: "You should definitely go. Maybe we could organise a group trip sometime?", zh: "你一定要去。也许我们可以找个时间一起组团？" },
      { speaker: "B", en: "That'd be great! Count me in.", zh: "那太棒了！算我一份。" },
      { speaker: "A", en: "Awesome. I'll let you know when I'm planning the next one.", zh: "太好了。我计划下一次的时候会通知你。" },
    ],
    keyphrases: [
      { en: "heading to", zh: "前往……（going to 的更口语说法）" },
      { en: "I've been meaning to", zh: "我一直打算……（表示拖延已久的计划）" },
      { en: "organise a group trip", zh: "组织集体活动/团体旅行" },
      { en: "Count me in", zh: "算我一份！（表示愿意参加）" },
      { en: "a quiet hike in the bush", zh: "在丛林里悠闲徒步" },
    ],
    aussiePhrases: [
      { en: "the bush", zh: "澳洲丛林/灌木林地（澳洲特有词汇）" },
      { en: "Blue Mountains", zh: "蓝山（悉尼近郊著名景点）" },
      { en: "Bondi Beach", zh: "邦迪海滩（悉尼标志性海滩）" },
    ],
  },
  {
    id: 3,
    title: "咖啡闲聊 / Coffee Chat",
    emoji: "☕",
    lines: [
      { speaker: "A", en: "Can I grab you a coffee?", zh: "要我帮你拿杯咖啡吗？" },
      { speaker: "B", en: "Oh, that'd be lovely. A flat white, please.", zh: "哦，太好了。请来一杯白咖啡。" },
      { speaker: "A", en: "Good choice. I'm getting a long black myself.", zh: "好选择。我自己要一杯长黑咖啡。" },
      { speaker: "B", en: "Are you a big coffee drinker?", zh: "你是个重度咖啡爱好者吗？" },
      { speaker: "A", en: "Absolutely. I can't function without my morning coffee.", zh: "当然。没有早上的咖啡我就没法运转。" },
      { speaker: "B", en: "Same! How many cups do you have a day?", zh: "我也是！你一天喝几杯？" },
      { speaker: "A", en: "Usually two, sometimes three if it's a busy day.", zh: "通常两杯，忙碌的时候有时会喝三杯。" },
      { speaker: "B", en: "This cafe does amazing coffee, by the way. Best in the area I reckon.", zh: "顺便说一下，这家咖啡馆的咖啡很棒。我觉得是这一带最好的。" },
      { speaker: "A", en: "Yeah, the barista here really knows what he's doing.", zh: "是啊，这里的咖啡师真的很专业。" },
      { speaker: "B", en: "Totally agree. I come here every morning before work.", zh: "完全同意。我每天早上上班前都会来这里。" },
      { speaker: "A", en: "Me too! We should have arranged to carpool ages ago.", zh: "我也是！我们早就应该安排拼车了。" },
    ],
    keyphrases: [
      { en: "Can I grab you a coffee?", zh: "要我帮你拿杯咖啡吗？（体贴的提议）" },
      { en: "flat white", zh: "白咖啡（澳洲发明的咖啡，浓缩+少量奶）" },
      { en: "long black", zh: "长黑（澳式美式咖啡，浓缩加热水）" },
      { en: "I can't function without my morning coffee", zh: "没有早晨咖啡我就没法运转" },
      { en: "I reckon", zh: "我认为/我觉得（澳洲极常用的口语词）" },
    ],
    aussiePhrases: [
      { en: "barista", zh: "咖啡师（澳洲咖啡文化中极重要的角色）" },
      { en: "carpool", zh: "拼车上下班" },
      { en: "ages ago", zh: "很久以前（口语表达）" },
    ],
  },
  {
    id: 4,
    title: "工作近况 / How's Work Going",
    emoji: "💼",
    lines: [
      { speaker: "A", en: "How's work been going lately?", zh: "最近工作怎么样？" },
      { speaker: "B", en: "Honestly, pretty flat out. We've got a big project on at the moment.", zh: "老实说，很忙碌。我们目前有一个大项目。" },
      { speaker: "A", en: "Oh yeah? What kind of project?", zh: "是吗？是什么类型的项目？" },
      { speaker: "B", en: "It's a new software rollout. Lots of late nights involved.", zh: "是一个新软件推出项目。需要很多深夜加班。" },
      { speaker: "A", en: "Sounds exhausting. At least the weekend's coming up.", zh: "听起来很累。至少周末快到了。" },
      { speaker: "B", en: "Thank goodness for that! How about you, how's your job going?", zh: "谢天谢地！你呢，你的工作怎么样？" },
      { speaker: "A", en: "Not too bad. Things have quieted down a bit after the busy season.", zh: "还不错。旺季过后事情稍微平静了一些。" },
      { speaker: "B", en: "That's good to hear. Do you enjoy what you do?", zh: "很高兴听到这个消息。你喜欢你的工作吗？" },
      { speaker: "A", en: "Most of the time, yeah. Some days are harder than others, though.", zh: "大多数时候是的。不过有些日子比其他日子更难熬。" },
      { speaker: "B", en: "I know that feeling! But that's just work, isn't it.", zh: "我懂那种感觉！但这就是工作，不是吗。" },
      { speaker: "A", en: "Exactly. At the end of the day, we just get on with it.", zh: "确实。到了最后，我们只是继续前进。" },
    ],
    keyphrases: [
      { en: "flat out", zh: "非常忙碌（澳洲口语，= very busy）" },
      { en: "a big project on", zh: "有个大项目在进行" },
      { en: "software rollout", zh: "软件推出/部署上线" },
      { en: "get on with it", zh: "继续做下去、坚持下去" },
      { en: "things have quieted down", zh: "事情平静下来了" },
    ],
    aussiePhrases: [
      { en: "flat out", zh: '忙得不可开交（澳洲最常用的"忙"的表达）' },
      { en: "Thank goodness for that!", zh: "太感谢了！谢天谢地！" },
      { en: "That's just work, isn't it", zh: "这就是工作嘛（表示无奈接受）" },
    ],
  },
  {
    id: 5,
    title: "搬家与新邻居 / Moving & New Neighbours",
    emoji: "🏠",
    lines: [
      { speaker: "A", en: "Hey, did you just move in next door?", zh: "嘿，你刚搬进隔壁吗？" },
      { speaker: "B", en: "Yeah, just last weekend. Still unpacking boxes!", zh: "是的，就是上周末。还在开箱子呢！" },
      { speaker: "A", en: "Welcome to the neighbourhood! I'm Sarah.", zh: "欢迎来到这个社区！我叫莎拉。" },
      { speaker: "B", en: "Thanks so much! I'm James. Nice to meet you.", zh: "非常感谢！我叫詹姆斯。很高兴认识你。" },
      { speaker: "A", en: "Where did you move from?", zh: "你从哪里搬来的？" },
      { speaker: "B", en: "Melbourne. I got a job transfer up to Sydney.", zh: "墨尔本。我的工作调到了悉尼。" },
      { speaker: "A", en: "Oh, big move! How are you finding Sydney so far?", zh: "哦，大搬家！到目前为止你觉得悉尼怎么样？" },
      { speaker: "B", en: "It's great, though I miss Melbourne's coffee culture a bit.", zh: "很棒，不过我有点想念墨尔本的咖啡文化。" },
      { speaker: "A", en: "Ha, I've heard that before! Melburnians always say that.", zh: "哈，我以前就听过这话！墨尔本人总是这么说。" },
      { speaker: "B", en: "It's true though! Don't tell me you disagree.", zh: "但这是真的！不要告诉我你不同意。" },
      { speaker: "A", en: "The coffee here isn't too bad, I promise. I'll show you the best spots.", zh: "我保证这里的咖啡还不错。我来带你去最好的地方。" },
      { speaker: "B", en: "That's really kind of you. I'd love that!", zh: "你真的很好心。我很乐意！" },
    ],
    keyphrases: [
      { en: "just moved in", zh: "刚搬进来" },
      { en: "Still unpacking boxes", zh: "还在开箱/整理行李" },
      { en: "Welcome to the neighbourhood!", zh: "欢迎来到这个社区！" },
      { en: "job transfer", zh: "工作调动" },
      { en: "How are you finding it?", zh: "你觉得……怎么样？（询问感受的常用句）" },
    ],
    aussiePhrases: [
      { en: "neighbourhood", zh: "社区/街区（澳式拼写，美式为 neighborhood）" },
      { en: "Melburnians", zh: "墨尔本人（当地人的称呼）" },
      { en: "coffee culture", zh: "咖啡文化（墨尔本以此著称）" },
    ],
  },
  {
    id: 6,
    title: "体育运动 / Sports Talk",
    emoji: "🏉",
    lines: [
      { speaker: "A", en: "Did you watch the footy last night?", zh: "你昨晚看足球（澳式橄榄球）了吗？" },
      { speaker: "B", en: "Of course! What a match that was.", zh: "当然！那场比赛真精彩。" },
      { speaker: "A", en: "I couldn't believe that last-minute goal.", zh: "我简直不敢相信最后一分钟的那个进球。" },
      { speaker: "B", en: "I know! My heart was racing the whole last quarter.", zh: "我知道！最后一节我的心脏一直在狂跳。" },
      { speaker: "A", en: "Are you a big footy fan?", zh: "你是个忠实的足球迷吗？" },
      { speaker: "B", en: "Huge! I go to games whenever I can. What about you?", zh: "非常热情！只要有机会我就去看现场比赛。你呢？" },
      { speaker: "A", en: "Same. I've got a season pass for the home games.", zh: "我也是。我有主场比赛的季票。" },
      { speaker: "B", en: "That's awesome. Which team do you barrack for?", zh: "太棒了。你支持哪支球队？" },
      { speaker: "A", en: "The Swans. Been a supporter since I was a kid.", zh: "悉尼天鹅队。从小就是他们的支持者。" },
      { speaker: "B", en: "Oh, rival! I go for Collingwood.", zh: "哦，对头来了！我支持科林伍德队。" },
      { speaker: "A", en: "Ha! We'll have to get together and watch a game sometime.", zh: "哈！有机会我们要聚在一起看场比赛。" },
    ],
    keyphrases: [
      { en: "footy", zh: "足球/澳式橄榄球（football的缩写，澳洲专属）" },
      { en: "What a match that was!", zh: "那场比赛真精彩！" },
      { en: "season pass", zh: "季票" },
      { en: "barrack for", zh: "支持（某球队）（澳洲特有用法，美式说 root for）" },
      { en: "last quarter", zh: "最后一节（澳式橄榄球分四节）" },
    ],
    aussiePhrases: [
      { en: "barrack for", zh: "支持某队（澳洲英语独有表达）" },
      { en: "footy", zh: "澳式橄榄球（AFL）的昵称" },
      { en: "The Swans / Collingwood", zh: "悉尼天鹅队/科林伍德队（知名AFL球队）" },
    ],
  },
  {
    id: 7,
    title: "食物与餐厅 / Food & Restaurants",
    emoji: "🍜",
    lines: [
      { speaker: "A", en: "Have you tried that new Thai restaurant on King Street?", zh: "你试过国王街那家新开的泰国餐厅吗？" },
      { speaker: "B", en: "Not yet! Is it good?", zh: "还没有！好吃吗？" },
      { speaker: "A", en: "Amazing. Best pad thai I've had in ages.", zh: "太好了。这是我很久以来吃过最好的泰式炒河粉。" },
      { speaker: "B", en: "Oh, I love Thai food. We should go sometime!", zh: "哦，我很喜欢泰国菜。我们应该找个时候去！" },
      { speaker: "A", en: "Definitely. They do great curries too.", zh: "当然。他们的咖喱也很棒。" },
      { speaker: "B", en: "I'm sold. How are the prices?", zh: "我心动了。价格怎么样？" },
      { speaker: "A", en: "Really reasonable. Main meals are around fifteen bucks.", zh: "非常实惠。主菜大约15澳元。" },
      { speaker: "B", en: "That's not bad at all for a sit-down place.", zh: "对于正式餐厅来说一点都不贵。" },
      { speaker: "A", en: "I know right? It gets busy on weekends so book ahead.", zh: "就是啊？周末很忙，所以要提前预订。" },
      { speaker: "B", en: "Good tip. Do they have vegetarian options?", zh: "好建议。他们有素食选择吗？" },
      { speaker: "A", en: "Heaps! My partner is vegetarian and she loves it there.", zh: "很多！我的伴侣是素食者，她很喜欢那里。" },
    ],
    keyphrases: [
      { en: "Have you tried...?", zh: "你试过……吗？（推荐餐厅的常见开场）" },
      { en: "in ages", zh: "好久以来（= for a long time）" },
      { en: "BYO", zh: "自带酒水（Bring Your Own，澳洲餐厅常见政策）" },
      { en: "reasonably priced", zh: "价格合理" },
      { en: "split the bill", zh: "各付各的/AA制" },
    ],
    aussiePhrases: [
      { en: "BYO", zh: "自带酒（澳洲餐厅特有政策，节省开销）" },
      { en: "pad thai", zh: "泰式炒河粉（多元文化下的常见美食）" },
      { en: "King Street", zh: "国王街（澳洲城市中常见的街道名）" },
    ],
  },
];

// ── 对话详情页 ──────────────────────────────────────────────────────────
function DialogueCard({ dialogue, onBack }) {
  const [showNotes, setShowNotes] = useState(false);

  const speakLine = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-AU';
      utt.rate = 0.85;
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </Button>

        {/* 标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{dialogue.emoji}</span>
            <h1 className="text-xl font-bold text-gray-900">{dialogue.title}</h1>
          </div>
          <p className="text-sm text-gray-400 ml-12">{dialogue.lines.length} 句对话</p>
        </div>

        {/* 对话气泡 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="space-y-5">
            {dialogue.lines.map((line, idx) => (
              <div key={idx} className={`flex gap-3 ${line.speaker === 'B' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm ${line.speaker === 'A' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                  {line.speaker}
                </div>
                <div className={`max-w-sm ${line.speaker === 'B' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 ${line.speaker === 'A' ? 'bg-blue-50 rounded-tl-sm' : 'bg-emerald-50 rounded-tr-sm'}`}>
                    <p className="text-gray-800 font-medium text-sm leading-relaxed">{line.en}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{line.zh}</p>
                  </div>
                  <button
                    onClick={() => speakLine(line.en)}
                    className={`flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors px-1 ${line.speaker === 'B' ? 'self-end' : 'self-start'}`}
                  >
                    <Volume2 className="w-3 h-3" /> 朗读
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 重点笔记折叠区 */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-left hover:bg-amber-100 transition-colors mb-3"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-800 text-sm">重点词句 & 澳洲表达</span>
          </div>
          <span className="text-amber-500 text-lg">{showNotes ? '▲' : '▼'}</span>
        </button>

        {showNotes && (
          <div className="space-y-3">
            {/* Key Phrases */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">📌</span>
                重点词句 Key Phrases
              </h3>
              <div className="space-y-2">
                {dialogue.keyphrases.map((kp, i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                    <button onClick={() => speakLine(kp.en)} className="flex-shrink-0 mt-0.5">
                      <Volume2 className="w-3.5 h-3.5 text-blue-400 hover:text-blue-600" />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-blue-700">{kp.en}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{kp.zh}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aussie Expressions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-base">🦘</span>
                澳洲常用表达 Aussie Expressions
              </h3>
              <div className="space-y-2">
                {dialogue.aussiePhrases.map((ap, i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                    <button onClick={() => speakLine(ap.en)} className="flex-shrink-0 mt-0.5">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 hover:text-emerald-600" />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">{ap.en}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ap.zh}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 列表主页 ──────────────────────────────────────────────────────────
export default function AussieDialogues() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <DialogueCard dialogue={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Aussie Small Talk 🗣️</h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          直击澳洲生活的 Small Talk 对话，覆盖各类日常场景，助你轻松破冰、拓展人脉，拒绝社交尴尬！
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💬</div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">日常闲聊</h2>
            <p className="text-sm text-gray-500">{DIALOGUES.length} 个对话</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIALOGUES.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{d.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm leading-snug">{d.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{d.lines.length} 句对话 · {d.keyphrases.length} 个重点词句</p>
                  <p className="text-xs text-gray-500 mt-2 italic line-clamp-1">"{d.lines[0].en}"</p>
                </div>
                <Play className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}