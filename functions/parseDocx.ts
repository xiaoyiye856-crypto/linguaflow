import mammoth from 'npm:mammoth';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';

Deno.serve(async (req) => {
    try {
        const { url } = await req.json();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        return Response.json({ text: result.value });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});