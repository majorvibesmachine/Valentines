import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { GamePhase } from '../types';

export const Lobby: React.FC = () => {
    const { joinRoom, setPhase, roomId } = useGameContext();
    const [inputRoomId, setInputRoomId] = useState('');

    const handleJoin = async () => {
        if (inputRoomId.trim()) {
            await joinRoom(inputRoomId.trim());
        }
    };

    const handleStart = async () => {
        await setPhase(GamePhase.TOAST);
    };

    if (roomId) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
                <h1 className="text-2xl font-bold">Lobby</h1>
                <p>Room ID: {roomId}</p>
                <button
                    onClick={handleStart}
                    className="rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-600"
                >
                    Start Game
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
            <h1 className="text-4xl font-bold text-pink-600">Love Sync</h1>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="rounded border p-2"
                />
                <button
                    onClick={handleJoin}
                    className="rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-600"
                >
                    Join Room
                </button>
            </div>
        </div>
    );
};
