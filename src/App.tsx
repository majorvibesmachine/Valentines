import React from 'react';
import { useGameContext } from './context/GameContext';
import { GameProvider } from './context/GameProvider';
import { GamePhase } from './types';
import { Lobby } from './components/Lobby';
import { ToastPhase } from './components/ToastPhase';
import { WriterPhase } from './components/WriterPhase';
import { PactPhase } from './components/PactPhase';

const GameRouter: React.FC = () => {
  const { phase } = useGameContext();

  switch (phase) {
    case GamePhase.LOBBY:
      return <Lobby />;
    case GamePhase.TOAST:
      return <ToastPhase />;
    case GamePhase.WRITER:
      return <WriterPhase />;
    case GamePhase.PACT:
      return <PactPhase />;
    default:
      return <div className="text-red-500">Unknown Phase</div>;
  }
};

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
