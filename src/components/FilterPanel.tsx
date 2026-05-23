import type { FilterState } from '../types';
import { exploits } from '../lib/data';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterPanel({ filters, onChange }: Props) {
  const vulnTypes = [...new Set(exploits.map(e => e.vulnerability_type))].sort();
  const platforms = [...new Set(exploits.map(e => e.platform))].sort();
  const architectures = [...new Set(exploits.map(e => e.architecture))].sort();
  const goals = [...new Set(exploits.map(e => e.payload_goal))].sort();

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
      <select
        value={filters.vulnType}
        onChange={(e) => onChange({ ...filters, vulnType: e.target.value })}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
      >
        <option value="">All Types</option>
        {vulnTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={filters.platform}
        onChange={(e) => onChange({ ...filters, platform: e.target.value })}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
      >
        <option value="">All Platforms</option>
        {platforms.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={filters.architecture}
        onChange={(e) => onChange({ ...filters, architecture: e.target.value })}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
      >
        <option value="">All Architectures</option>
        {architectures.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <select
        value={filters.payloadGoal}
        onChange={(e) => onChange({ ...filters, payloadGoal: e.target.value })}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
      >
        <option value="">All Goals</option>
        {goals.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span>CVSS:</span>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Min"
          value={filters.minCvss || ''}
          onChange={(e) => onChange({ ...filters, minCvss: parseFloat(e.target.value) || 0 })}
          className="w-16 bg-[var(--bg-card)] border border-[var(--border)] rounded px-2 py-2 text-center text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
        />
        <span>-</span>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Max"
          value={filters.maxCvss < 10 ? filters.maxCvss : ''}
          onChange={(e) => onChange({ ...filters, maxCvss: parseFloat(e.target.value) || 10 })}
          className="w-16 bg-[var(--bg-card)] border border-[var(--border)] rounded px-2 py-2 text-center text-[var(--text-primary)] focus:border-[var(--accent)] outline-none"
        />
      </div>
    </div>
  );
}
