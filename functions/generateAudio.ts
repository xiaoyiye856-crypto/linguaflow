import { createClientFromRequest } from 'npm:@base44/sdk@0.8.18';
import OpenAI from 'npm:openai';
import { encodeBase64 } from "jsr:@std/encoding/base64";

const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
    try {
        const { text } = await req.json();
        
        if (!text) {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "onyx", // Onyx is a deep, male voice
            input: text,
        });

        const buffer = await mp3.arrayBuffer();
        const base64 = encodeBase64(new Uint8Array(buffer));

        return Response.json({ audio: `data:audio/mpeg;base64,${base64}` });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
});