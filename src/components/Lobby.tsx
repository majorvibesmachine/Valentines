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

    return (
        <div className="min-h-dvh w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
                <div className="mb-8 animate-pulse">
                    <span className="text-6xl">❤️</span>
                </div>

                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent tracking-tight">
                    Love Sync
                </h1>

                <p className="text-zinc-400 mb-12 text-lg font-medium leading-relaxed">
                    Synchronize your hearts.<br />
                    Stay connected, everywhere.
                </p>

                {roomId ? (
                    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-bold">Room Active</p>
                            <p className="text-2xl font-mono font-bold text-white tracking-widest">{roomId}</p>
                        </div>

                        <button
                            onClick={handleStart}
                            className="group relative w-full h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl font-bold text-white shadow-xl shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                Enter Protocol
                            </span>
                        </button>
                    </div>
                ) : (
                    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="relative group">
                            <input
                                type="text"
                                value={inputRoomId}
                                onChange={(e) => setInputRoomId(e.target.value)}
                                placeholder="Enter Room ID..."
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-lg font-medium outline-none transition-all focus:border-pink-500/50 focus:bg-white/8 placeholder:text-zinc-600"
                            />
                        </div>

                        <button
                            onClick={handleJoin}
                            disabled={!inputRoomId.trim()}
                            className="w-full h-14 bg-zinc-100 text-zinc-950 rounded-xl font-bold transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-white/5"
                        >
                            <span className="text-lg">Join Lobby</span>
                        </button>
                    </div>
                )}

                <p className="mt-12 text-zinc-600 text-xs font-medium uppercase tracking-[0.2em]">
                    The Love Sync Protocol 1.0
                </p>
            </div>
        </div>
    );
};
