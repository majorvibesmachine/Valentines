import React, { useState, useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
// Actually standard import in Vite for tsx doesn't need extension usually.
// Let's stick to standard import.

export const PactPhase: React.FC = () => {
    const { userId } = useGameContext();
    const [myVow, setMyVow] = useState('');
    const [partnerVow, setPartnerVow] = useState(''); // In a real app we might sync this, but for now local input or sync via context if we had it.
    // The plan said "Goal Inputs: Text areas for 'My Vow' and 'Partner's Vow' (or just personal vows)."
    // Let's stick to simple local state for the prototype as per "Growth Pact" module description.

    const [isSigned, setIsSigned] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

    // Canvas Logic
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { x, y } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
        e.preventDefault(); // Prevent scrolling on touch
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);
        ctx.lineTo(x, y);
        ctx.stroke();
        e.preventDefault();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handlePreviewContract = () => {
        if (canvasRef.current) {
            setSignatureDataUrl(canvasRef.current.toDataURL());
            setIsSigned(true);
        }
    };

    // Initialize Canvas props
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && !isSigned) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000000';
            }
        }
    }, [isSigned]); // Re-init if we switch views back and forth, though we only switch forward here.

    if (isSigned) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4 print:bg-white print:p-0">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full border-8 border-double border-red-200 print:shadow-none print:border-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-serif text-red-800 mb-2 font-bold">The Love Protocol</h1>
                        <p className="text-gray-500 italic">Official Agreement of Growth & Sync</p>
                    </div>

                    <div className="space-y-6 mb-12">
                        <div className="p-4 bg-red-50 rounded-lg print:bg-transparent print:border-b print:border-gray-200 print:rounded-none">
                            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-1">My Vow</h3>
                            <p className="text-xl font-serif text-gray-800">{myVow || "To always keep the toast level equal..."}</p>
                        </div>
                        {partnerVow && (
                            <div className="p-4 bg-blue-50 rounded-lg print:bg-transparent print:border-b print:border-gray-200 print:rounded-none">
                                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Partner's Vow</h3>
                                <p className="text-xl font-serif text-gray-800">{partnerVow}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end mt-16 print:mt-24">
                        <div className="flex-1 mr-4">
                            <div className="border-b-2 border-gray-400 pb-2 mb-2">
                                <img src={signatureDataUrl || ''} alt="Signature" className="h-16 object-contain block mx-auto" />
                            </div>
                            <p className="text-center text-xs text-gray-400 uppercase tracking-widest">Signed, {userId.slice(0, 8)}</p>
                        </div>
                        <div className="flex-1 ml-4">
                            <div className="border-b-2 border-gray-400 pb-2 mb-2 h-20"></div>
                            <p className="text-center text-xs text-gray-400 uppercase tracking-widest">Witnessed By The Internet</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center print:hidden">
                        <button
                            onClick={handlePrint}
                            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                        >
                            Seal & Print
                        </button>
                        <button
                            onClick={() => setIsSigned(false)}
                            className="ml-4 text-gray-500 hover:text-gray-800 underline"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl space-y-6">
                <h2 className="text-2xl font-bold text-center text-red-600">Draft Your Pact</h2>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">What is your promise?</label>
                    <textarea
                        value={myVow}
                        onChange={(e) => setMyVow(e.target.value)}
                        placeholder="I promise to..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none h-32"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">What do you hope for?</label>
                    <textarea
                        value={partnerVow}
                        onChange={(e) => setPartnerVow(e.target.value)}
                        placeholder="I hope we..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none h-32"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Sign Here</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden touch-none h-40 relative bg-gray-50">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <button
                            onClick={clearCanvas}
                            className="absolute top-2 right-2 text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                        >
                            Clear
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center">Use your mouse or finger to sign.</p>
                </div>

                <button
                    onClick={handlePreviewContract}
                    disabled={!myVow}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-lg shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                    Preview Contract
                </button>
            </div>
        </div>
    );
};
