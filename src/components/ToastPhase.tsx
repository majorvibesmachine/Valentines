import React, { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useGlassFill } from '../hooks/useGlassFill';

export const ToastPhase: React.FC = () => {
    const { userId, toastState, updateFill } = useGameContext();

    // Get partner's ID (anyone who isn't me)
    const partnerId = Object.keys(toastState).find(id => id !== userId);

    // My fill logic
    const {
        currentFill: myFill,
        startPouring,
        stopPouring,
        isPouring
    } = useGlassFill({
        updateFill,
        initialFill: toastState[userId] || 0
    });

    // Partner's fill level (read from context)
    const partnerFill = partnerId ? (toastState[partnerId] || 0) : 0;

    const isFull = myFill >= 100;
    const isPartnerFull = partnerFill >= 100;

    // Trigger vibration/haptic when pouring
    useEffect(() => {
        if (isPouring && navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, [isPouring]);

    return (
        <div className="flex h-[100dvh] w-full flex-col items-center justify-around bg-pink-50 p-4 transition-colors duration-1000">
            <div className="text-center">
                <h1 className="mb-2 text-3xl font-bold text-pink-600">Time for a Toast!</h1>
                <p className="text-pink-400">Hold the button to fill your glass.</p>
            </div>

            <div className="flex w-full max-w-md items-end justify-center gap-8">
                {/* My Glass */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-pink-500">You</span>
                    <div className="relative h-48 w-24 overflow-hidden rounded-b-xl border-4 border-pink-300 bg-white/50 backdrop-blur-sm">
                        <div
                            className="absolute bottom-0 w-full bg-pink-400 transition-all duration-100 ease-linear"
                            style={{ height: `${myFill}%` }}
                        >
                            <div className="absolute top-0 h-2 w-full animate-pulse bg-pink-300/50"></div>
                            {/* Bubbles */}
                            {isPouring && (
                                <div className="absolute inset-0 flex items-end justify-center">
                                    <div className="animate-bounce text-2xl">🫧</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onMouseDown={startPouring}
                        onMouseUp={stopPouring}
                        onMouseLeave={stopPouring}
                        onTouchStart={startPouring}
                        onTouchEnd={stopPouring}
                        disabled={isFull}
                        className={`rounded-full px-6 py-3 font-bold text-white shadow-lg transition-all 
                            ${isFull
                                ? 'bg-green-400'
                                : 'bg-pink-500 active:scale-95 active:bg-pink-600'
                            }`}
                    >
                        {isFull ? 'Ready!' : 'Hold to Pour'}
                    </button>
                </div>

                {/* Partner's Glass */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-pink-500">Partner</span>
                    <div className="relative h-48 w-24 overflow-hidden rounded-b-xl border-4 border-pink-300 bg-white/50 backdrop-blur-sm">
                        <div
                            className="absolute bottom-0 w-full bg-pink-400 transition-all duration-200 ease-linear"
                            style={{ height: `${partnerFill}%` }}
                        >
                            <div className="absolute top-0 h-2 w-full animate-pulse bg-pink-300/50"></div>
                        </div>
                    </div>
                    <div className={`mt-3 text-2xl transition-opacity ${isPartnerFull ? 'opacity-100' : 'opacity-0'}`}>
                        ✅
                    </div>
                </div>
            </div>

            {/* Success State */}
            {isFull && isPartnerFull && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="animate-in zoom-in slide-in-from-bottom-10 relative rounded-2xl bg-white p-8 text-center shadow-2xl">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl">
                            🥂
                        </div>
                        <h2 className="mt-8 text-2xl font-bold text-pink-600">Cheers!</h2>
                        <p className="text-gray-600">You're in sync!</p>
                    </div>
                </div>
            )}
        </div>
    );
};
