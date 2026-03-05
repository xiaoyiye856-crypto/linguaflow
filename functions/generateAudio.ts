// This function is no longer the primary audio source.
// Audio is now handled client-side via Web Speech API.
// Keeping as a passthrough for backward compatibility.
Deno.serve(async (req) => {
    return Response.json({ error: 'Use client-side TTS instead' }, { status: 400 });
});