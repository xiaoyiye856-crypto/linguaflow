import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const dialogues = await base44.asServiceRole.entities.AussieDialogue.list();

        for (const dialogue of dialogues) {
            if (!dialogue.admin_notes || dialogue.admin_notes.length === 0) {
                const prompt = `Extract 2-4 key Australian English words or phrases from this dialogue, and provide a short Chinese explanation. Return in this JSON format: {"notes": [{"word": "English word", "note": "Chinese explanation"}]}

Dialogue:
${dialogue.lines.map(l => `${l.speaker}: ${l.en}`).join('\n')}`;

                const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
                    prompt,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            notes: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        word: { type: "string" },
                                        note: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                });

                if (response.notes) {
                    await base44.asServiceRole.entities.AussieDialogue.update(dialogue.id, { admin_notes: response.notes });
                }
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});