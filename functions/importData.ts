import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { file_url, type } = await req.json();

        let json_schema;
        let entityName;

        if (type === 'sentence') {
            json_schema = {
                type: "object",
                properties: {
                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                chinese: { type: "string" },
                                wrong_en: { type: "string" },
                                correct_en: { type: "string" },
                                explanation: { type: "string" },
                                category: { type: "string" }
                            }
                        }
                    }
                }
            };
            entityName = 'AussieSentence';
        } else if (type === 'dialogue') {
            json_schema = {
                type: "object",
                properties: {
                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                context: { type: "string" },
                                lines: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            speaker: { type: "string" },
                                            en: { type: "string" },
                                            zh: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            entityName = 'AussieDialogue';
        }

        const result = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
            file_url,
            json_schema
        });

        if (result.status === 'success' && result.output) {
            let dataToInsert = result.output;
            if (dataToInsert.items) dataToInsert = dataToInsert.items;
            
            if (Array.isArray(dataToInsert)) {
                await base44.asServiceRole.entities[entityName].bulkCreate(dataToInsert);
                return Response.json({ success: true, count: dataToInsert.length });
            }
        }
        
        return Response.json({ success: false, result });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});