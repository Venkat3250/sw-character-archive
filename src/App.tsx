import { AuthProvider } from './context/AuthContext';
import { AuthGate } from './components/AuthGate';
import { CharacterExplorer } from './components/CharacterExplorer';

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <CharacterExplorer />
      </AuthGate>
    </AuthProvider>
  );
}
