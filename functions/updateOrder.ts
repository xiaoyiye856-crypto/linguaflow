import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const allSentences = await base44.asServiceRole.entities.AussieSentence.list();
        
        let mateId = null;
        let seeyaId = null;
        
        for (const s of allSentences) {
            if (s.correct_en && s.correct_en.toLowerCase().includes('mate')) {
                mateId = s.id;
            }
            if (s.correct_en && s.correct_en.toLowerCase().includes('see ya')) {
                seeyaId = s.id;
            }
            if (s.correct_en && s.correct_en.toLowerCase().includes('catch ya later')) {
                seeyaId = s.id;
            }
        }
        
        if (mateId) {
            await base44.asServiceRole.entities.AussieSentence.update(mateId, { sort_order: -10 });
        }
        if (seeyaId) {
            await base44.asServiceRole.entities.AussieSentence.update(seeyaId, { sort_order: -9 });
        }
        
        return Response.json({ mateId, seeyaId, count: allSentences.length });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});