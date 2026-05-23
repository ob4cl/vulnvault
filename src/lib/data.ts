import type { Exploit, FilterState } from '../types';

const exploits: Exploit[] = [];

let loaded = false;

async function loadExploits(): Promise<Exploit[]> {
  if (loaded) return exploits;
  const response = await fetch('/src/data/exploits.json');
  const data: Exploit[] = await response.json();
  exploits.length = 0;
  exploits.push(...data);
  loaded = true;
  return exploits;
}

export function filterExploits(
  data: Exploit[],
  filters: FilterState
): Exploit[] {
  return data.filter((e) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const match =
        e.exploit_id?.toLowerCase().includes(q) ||
        e.cve?.toLowerCase().includes(q) ||
        e.vulnerability_type?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.platform?.toLowerCase().includes(q) ||
        e.payload_goal?.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.vulnType && e.vulnerability_type !== filters.vulnType) return false;
    if (filters.platform && e.platform !== filters.platform) return false;
    if (filters.architecture && e.architecture !== filters.architecture) return false;
    if (filters.payloadGoal && e.payload_goal !== filters.payloadGoal) return false;

    const cvss = parseFloat(String(e.cvss_score));
    if (filters.minCvss > 0 && (isNaN(cvss) || cvss < filters.minCvss)) return false;
    if (filters.maxCvss < 10 && (isNaN(cvss) || cvss > filters.maxCvss)) return false;

    return true;
  });
}

export function getUniqueValues(data: Exploit[], field: keyof Exploit): string[] {
  return [...new Set(data.map((e) => String(e[field] || '')))].filter(Boolean).sort();
}

export { loadExploits, exploits };
