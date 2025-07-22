export async function generateTagsWithGroq(prompt) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq API key is missing!');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates short, relevant tags for Twitch clips.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 50,
      temperature: 0.7,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error('Groq API error: ' + (errorData.error?.message || response.statusText));
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
} 