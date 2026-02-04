export const GamePhase = {
    LOBBY: 'LOBBY',
    TOAST: 'TOAST',
    WRITER: 'WRITER',
    PACT: 'PACT'
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

export interface ToastState {
    [userId: string]: number; // 0 to 100
}

export interface GameContextType {
    userId: string;
    roomId: string | null;
    partnerId: string | null;
    phase: GamePhase;
    toastState: ToastState;
    joinRoom: (roomId: string) => Promise<void>;
    setPhase: (phase: GamePhase) => Promise<void>;
    updateFill: (fill: number) => Promise<void>;
}
