import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { GameContext } from './GameContext';
import { GamePhase } from '../types';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
    const [roomId, setRoomId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [partnerId, _setPartnerId] = useState<string | null>(null);
    const [phase, setLocalPhase] = useState<GamePhase>(GamePhase.LOBBY);
    const [toastState, setToastState] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!roomId) return;

        const roomRef = ref(db, `rooms/${roomId}`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.phase) setLocalPhase(data.phase);
                if (data.toast) setToastState(data.toast);
            }
        });

        return () => unsubscribe();
    }, [roomId]);

    const joinRoom = async (newRoomId: string) => {
        setRoomId(newRoomId);
    };

    const setPhase = async (newPhase: GamePhase) => {
        if (!roomId) return;
        await set(ref(db, `rooms/${roomId}/phase`), newPhase);
    };

    const updateFill = async (fill: number) => {
        if (!roomId || !userId) return;
        await set(ref(db, `rooms/${roomId}/toast/${userId}`), fill);
    };

    return (
        <GameContext.Provider value={{ userId, roomId, partnerId, phase, toastState, joinRoom, setPhase, updateFill }}>
            {children}
        </GameContext.Provider>
    );
};
