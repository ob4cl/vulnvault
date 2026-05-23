import { useState } from 'react';
import type { Exploit } from './types';
import Home from './pages/Home';
import ExploitDetail from './pages/ExploitDetail';

export default function App() {
  const [selected, setSelected] = useState<Exploit | null>(null);

  if (selected) {
    return (
      <ExploitDetail
        exploit={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return <Home onSelectExploit={setSelected} />;
}
