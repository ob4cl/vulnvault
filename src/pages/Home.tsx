import { useState, useEffect, useMemo } from 'react';
import type { Exploit, FilterState } from '../types';
import { loadExploits, filterExploits, exploits } from '../lib/data';
import { searchExploits } from '../lib/deepseek';
import FilterPanel from '../components/FilterPanel';
import ExploitCard from '../components/ExploitCard';

interface Props {
  onSelectExploit: (exploit: Exploit) => void;
}

export default function Home({ onSelectExploit }: Props) {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    vulnType: '',
    platform: '',
    architecture: '',
    payloadGoal: '',
    minCvss: 0,
    maxCvss: 10,
  });
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadExploits().then(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterExploits(exploits, filters),
    [exploits, filters]
  );

  const handleAISearch = async () => {
    if (!filters.query.trim()) return;
    setAiLoading(true);
    const explanation = await searchExploits(filters.query);
    setAiExplanation(explanation);
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--accent)]">Vuln</span>Vault
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          AI-powered exploit database • {exploits.length} exploits indexed
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder='Search exploits... try "Windows RCE with reverse shell" or "buffer overflow x64"'
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
            className="search-glow flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all"
          />
          <button
            onClick={handleAISearch}
            disabled={aiLoading || !filters.query.trim()}
            className="px-6 py-3 bg-[var(--accent)] hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
          >
            {aiLoading ? '🤔 Thinking...' : '🔍 AI Search'}
          </button>
        </div>
        {aiExplanation && (
          <div className="mt-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg text-sm text-[var(--text-secondary)]">
            🤖 {aiExplanation}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      {/* Stats */}
      <div className="mb-4 text-xs text-[var(--text-secondary)]">
        Showing {filtered.length} of {exploits.length} exploits
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          Loading exploits...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((exploit) => (
            <ExploitCard
              key={exploit.exploit_id}
              exploit={exploit}
              onClick={() => onSelectExploit(exploit)}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-secondary)] text-lg mb-2">No exploits found</p>
          <p className="text-[var(--text-secondary)] text-sm">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
