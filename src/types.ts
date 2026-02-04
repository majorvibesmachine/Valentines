export const GamePhase = {
    LOBBY: 'LOBBY',
    TOAST: 'TOAST',
    WRITER: 'WRITER',
    PACT: 'PACT'
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

export interface GameContextType {
    userId: string;
    roomId: string | null;
    partnerId: string | null;
    phase: GamePhase;
    joinRoom: (roomId: string) => Promise<void>;
    setPhase: (phase: GamePhase) => Promise<void>;
}
