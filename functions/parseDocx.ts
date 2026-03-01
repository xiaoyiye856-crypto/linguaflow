import mammoth from 'npm:mammoth';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { url } = await req.json();
        
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        
        const text = result.value;
        const dialogues = [];
        
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        let currentDialogue = null;
        let currentLine = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (/^\d+\.\s/.test(line)) {
                if (currentDialogue && currentDialogue.lines.length > 0) {
                    dialogues.push(currentDialogue);
                }
                const title = line.replace(/^\d+\.\s*/, '');
                currentDialogue = {
                    title: title,
                    context: title.split('/')[0]?.trim() || title,
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
                    currentLine = { speaker, en: content, zh: "" };
                    currentDialogue.lines.push(currentLine);
                } else {
                    if (currentLine && currentLine.speaker === speaker) {
                        currentLine.zh = content;
                    } else if (currentLine) {
                        currentLine.zh = content;
                    }
                }
            }
        }
        if (currentDialogue && currentDialogue.lines.length > 0) {
            dialogues.push(currentDialogue);
        }
        
        if (dialogues.length > 0) {
            await base44.asServiceRole.entities.AussieDialogue.bulkCreate(dialogues);
        }
        
        return Response.json({ success: true, count: dialogues.length, sample: dialogues[0] });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});