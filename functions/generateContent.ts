import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { type, topics } = await req.json(); 
        
        let results = [];
        
        for (const topic of topics) {
            let prompt = "";
            let schema = {};
            
            if (type === 'vocabulary') {
                prompt = `Generate a useful Australian English phrase for the topic/category: "${topic}". Provide the phrase (word), phonetic, part_of_speech, chinese translation, example_en, example_zh, and category (use the topic name).`;
                schema = {
                    type: "object",
                    properties: {
                        word: {type: "string"},
                        phonetic: {type: "string"},
                        part_of_speech: {type: "string"},
                        chinese: {type: "string"},
                        example_en: {type: "string"},
                        example_zh: {type: "string"},
                        category: {type: "string"}
                    }
                };
            } else if (type === 'dialogue') {
                prompt = `Generate an Australian Small Talk conversation about: "${topic}". Include title, context, category (general topic), usefulness_score (1-100), cultural_extension. The lines array must have at least 6 lines, alternating speakers, with gender (male/female), en, and zh.`;
                schema = {
                    type: "object",
                    properties: {
                        title: {type: "string"},
                        context: {type: "string"},
                        category: {type: "string"},
                        usefulness_score: {type: "number"},
                        cultural_extension: {type: "string"},
                        lines: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    speaker: {type: "string"},
                                    gender: {type: "string"},
                                    en: {type: "string"},
                                    zh: {type: "string"}
                                }
                            }
                        }
                    }
                };
            }
            
            const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
            if (res) results.push(res);
        }
        
        if (results.length > 0) {
            if (type === 'vocabulary') {
                await base44.asServiceRole.entities.AussieVocabulary.bulkCreate(results);
            } else {
                await base44.asServiceRole.entities.AussieDialogue.bulkCreate(results);
            }
        }
        
        return Response.json({ success: true, count: results.length });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});