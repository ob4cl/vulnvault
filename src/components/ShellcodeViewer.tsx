import { useState } from 'react';

interface Props {
  shellcode: string;
}

export default function ShellcodeViewer({ shellcode }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shellcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format shellcode into chunks of 8 bytes per line
  const bytes = shellcode.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += 8) {
    lines.push(bytes.slice(i, i + 8).join(' '));
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--text-secondary)]">
          {bytes.length} bytes • {lines.length} lines
        </span>
        <button
          onClick={copyToClipboard}
          className="text-xs px-3 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <pre className="shellcode bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[var(--text-secondary)] opacity-40 mr-4 select-none w-8 text-right">
              {String(i * 8).padStart(3, '0')}
            </span>
            <span className="text-[var(--text-primary)]">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
