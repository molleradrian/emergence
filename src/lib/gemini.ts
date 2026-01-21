/**
 * Direct Gemini API utility for Lattice Nodes
 * Bypasses backend latency for real-time poetic substrate analysis.
 */

export async function analyzeSubstrate(entities: any[]) {
  const apiKey = (typeof window !== 'undefined' && (window as any).apiKey) || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey) return "Intelligence offline. Missing API Key.";

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
    Context: Aetherium OS Lattice Substrate.
    System State: ${entities.length} active biotes.
    Task: Provide a one-sentence poetic observation of this emergence.
    Tone: Philosophical, cybernetic, brief.
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Coherence lost in transmission.";
  } catch (err) {
    console.error("Gemini Analysis Error:", err);
    return "The substrate remains silent.";
  }
}
