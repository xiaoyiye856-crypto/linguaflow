import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const sentences = await base44.asServiceRole.entities.AussieSentence.list();
        
        const toUpdate = sentences.filter(s => !s.cultural_extension).slice(0, 10);
        if (toUpdate.length === 0) return Response.json({ success: true, count: 0 });

        const prompt = `For each of these 10 phrases, provide a usefulness_score (1-100) and a brief cultural_extension (Aussie context).\n\n` + 
            toUpdate.map((s, i) => `${i}. ${s.correct_en}`).join('\n');

        const res = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    results: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                index: {type: "number"},
                                usefulness_score: {type: "number"},
                                cultural_extension: {type: "string"}
                            }
                        }
                    }
                }
            }
        });

        for (const item of res.results) {
            const s = toUpdate[item.index];
            if (s) {
                await base44.asServiceRole.entities.AussieSentence.update(s.id, {
                    usefulness_score: item.usefulness_score,
                    cultural_extension: item.cultural_extension
                });
            }
        }

        return Response.json({ success: true, count: toUpdate.length });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});