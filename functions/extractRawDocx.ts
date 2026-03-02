import mammoth from 'npm:mammoth';

Deno.serve(async (req) => {
    try {
        const { url } = await req.json();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        return Response.json({ success: true, text: result.value });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});