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

            const res = await base44.integrations.Core.InvokeLLM({
                prompt: `You are a data extractor. Extract the data from the following text based on the requested format.
Type: ${type}
Text:
${text}

For 'vocabulary', extract the 100 phrases. They have a category (from the section header), word (the English phrase), phonetic, part_of_speech (optional), chinese, example_en, example_zh.
For 'dialogue', extract the small talk conversations. They have title, context, category, usefulness_score (1-100), cultural_extension (a brief interesting cultural fact about the topic). The lines array should specify the speaker, their gender (male/female/neutral), en, zh. Male/female should be alternating if there are 2 speakers.
For 'sentence', extract sentences (wrong_en, correct_en, explanation, chinese), add category, usefulness_score (1-100), cultural_extension.`,
                response_json_schema: type === 'vocabulary' ? {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    word: {type: "string"},
                                    phonetic: {type: "string"},
                                    part_of_speech: {type: "string"},
                                    chinese: {type: "string"},
                                    example_en: {type: "string"},
                                    example_zh: {type: "string"},
                                    category: {type: "string"}
                                },
                                required: ["word", "chinese"]
                            }
                        }
                    }
                } : type === 'dialogue' ? {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: {
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
                                },
                                required: ["title"]
                            }
                        }
                    }
                } : {}
            });

            if (res && res.items) {
                allResults.push(...res.items);
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