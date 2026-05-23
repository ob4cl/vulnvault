import type { AIResponse, Exploit } from '../types';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const API_URL = 'https://api.deepseek.com/chat/completions';

export async function analyzeExploit(exploit: Exploit): Promise<AIResponse> {
  const prompt = `You are a security expert analyzing an exploit. Provide a concise analysis.

Exploit details:
- CVE: ${exploit.cve}
- Type: ${exploit.vulnerability_type}
- Platform: ${exploit.platform} / ${exploit.architecture}
- Payload Goal: ${exploit.payload_goal}
- CVSS: ${exploit.cvss_score}
- Description: ${exploit.description}
- Shellcode (first 500 chars): ${exploit.shellcode?.substring(0, 500)}

Respond in this exact JSON format:
{
  "analysis": "2-3 sentence analysis of how this exploit works and its impact",
  "related_cves": ["RELATED-CVE-1", "RELATED-CVE-2"],
  "mitigation": "2-3 sentence practical mitigation advice"
}`;

  if (!API_KEY) {
    return {
      analysis: "API key not configured. Add VITE_DEEPSEEK_API_KEY to .env to enable AI analysis.",
      related_cves: [],
      mitigation: "Configure the DeepSeek API key for AI-powered analysis.",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      analysis: content || 'Analysis unavailable.',
      related_cves: [],
      mitigation: '',
    };
  } catch (error) {
    return {
      analysis: 'AI analysis temporarily unavailable.',
      related_cves: [],
      mitigation: '',
    };
  }
}

export async function searchExploits(query: string): Promise<string> {
  if (!API_KEY) return '';

  const prompt = `You are a security exploit database search assistant. Given a natural language query about security exploits, return a structured response.

Query: "${query}"

Respond with a JSON object:
{
  "vulnerability_types": ["type1", "type2"],
  "platforms": ["platform1"],
  "explanation": "Brief explanation of what vulnerabilities match this query"
}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.explanation || '';
    }
    return '';
  } catch {
    return '';
  }
}
