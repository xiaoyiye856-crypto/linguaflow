export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  const { prompt, response_json_schema } = req.body;

  const systemPrompt = response_json_schema
      ? `You are a helpful assistant. Always respond with valid JSON that matches this schema: ${JSON.stringify(response_json_schema)}. Do not include any text outside the JSON.`
        : 'You are a helpful assistant.';

  try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                          'Content-Type': 'application/json',
                          'x-api-key': process.env.ANTHROPIC_API_KEY,
                          'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                          model: 'claude-haiku-4-5-20251001',
                          max_tokens: 2000,
                          system: systemPrompt,
                          messages: [{ role: 'user', content: prompt }],
                }),
        });

      const data = await response.json();

      if (!response.ok) {
              return res.status(500).json({ error: data.error?.message || 'API error' });
      }

      const text = data.content?.[0]?.text || '';

      if (response_json_schema) {
              try {
                        const parsed = JSON.parse(text);
                        return res.status(200).json(parsed);
              } catch {
                        return res.status(200).json({ raw: text });
              }
      }

      return res.status(200).json({ result: text });
  } catch (error) {
        return res.status(500).json({ error: error.message });
  }
}
