import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';
import mammoth from 'npm:mammoth';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { urls, type } = await req.json();
        
        let allResults = [];

        for (const url of urls) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const result = await mammoth.extractRawText({ buffer });
            const text = result.value;
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);

            if (type === 'vocabulary') {
                let currentCat = "Other";
                let currentItem = null;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.startsWith('◆')) {
                        currentCat = line.replace('◆', '').trim();
                        continue;
                    }
                    if (/^\d{2}$/.test(line)) {
                        if (currentItem && currentItem.word) allResults.push(currentItem);
                        currentItem = { category: currentCat };
                        continue;
                    }
                    if (!currentItem) continue;

                    if (!currentItem.word && /^[a-zA-Z\s\-']+$/.test(line)) {
                        currentItem.word = line;
                    } else if (!currentItem.phonetic && line.startsWith('/')) {
                        currentItem.phonetic = line;
                    } else if (currentItem.word && !currentItem.chinese && /[\u4e00-\u9fa5]/.test(line) && !line.startsWith('1.') && !line.startsWith('2.')) {
                        currentItem.chinese = line;
                    } else if (line.startsWith('1.')) {
                        currentItem.example_en = line.substring(2).trim();
                    } else if (currentItem.example_en && !currentItem.example_zh && /[\u4e00-\u9fa5]/.test(line)) {
                        currentItem.example_zh = line;
                    }
                }
                if (currentItem && currentItem.word) allResults.push(currentItem);
            } 
            else if (type === 'dialogue') {
                let currentDialogue = null;
                let lastSpeakerEn = null;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    if (/^\d+\.\s/.test(line)) {
                        if (currentDialogue && currentDialogue.lines.length > 0) {
                            allResults.push(currentDialogue);
                        }
                        const title = line.replace(/^\d+\.\s*/, '');
                        currentDialogue = {
                            title: title,
                            context: title.split('/')[0]?.trim() || title,
                            category: "Small Talk",
                            usefulness_score: 95,
                            lines: []
                        };
                        continue;
                    }
                    
                    const match = line.match(/^([A-Za-z0-9\s]+)[:：]\s*(.*)/);
                    if (match && currentDialogue) {
                        let speaker = match[1].trim();
                        const content = match[2].trim();
                        const hasChinese = /[\u4e00-\u9fa5]/.test(content);
                        
                        if (!hasChinese) {
                            lastSpeakerEn = { 
                                speaker, 
                                en: content, 
                                zh: "",
                                gender: currentDialogue.lines.length % 2 === 0 ? "female" : "male" 
                            };
                            currentDialogue.lines.push(lastSpeakerEn);
                        } else {
                            if (lastSpeakerEn && lastSpeakerEn.speaker === speaker) {
                                lastSpeakerEn.zh = content;
                            }
                        }
                    }
                }
                if (currentDialogue && currentDialogue.lines.length > 0) {
                    allResults.push(currentDialogue);
                }
            }
        }

        if (allResults.length > 0) {
            if (type === 'vocabulary') {
                await base44.asServiceRole.entities.AussieVocabulary.bulkCreate(allResults);
            } else if (type === 'dialogue') {
                await base44.asServiceRole.entities.AussieDialogue.bulkCreate(allResults);
            }
        }

        return Response.json({ success: true, count: allResults.length, sample: allResults[0] });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});