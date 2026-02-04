import React from 'react';
import { Icon } from './Icon';

interface StartupScreenProps {
    onAboutClick: () => void;
    isExiting?: boolean;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onAboutClick, isExiting }) => {
    return (
        <div className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden box-border transition-opacity duration-400 ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="flex flex-col items-center justify-center gap-8 z-10 animate-[fadeIn_0.5s_ease-out]">



                {/* Text Content */}
                <div className="text-center">
                    <h1 className="text-primary tracking-tight text-5xl font-bold animate-[slideUp_0.8s_ease-out]">
                        DeepCheck
                    </h1>
                </div>

                {/* Loading Spinner */}
                <div className="mt-12">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                </div>

            </div>

            {/* Footer Version */}
            <div className="absolute bottom-8 flex flex-col items-center gap-2">

                <button
                    onClick={onAboutClick}
                    className="text-xs text-slate-400 font-medium hover:text-primary transition-colors px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-full z-20"
                >
                    Version 1.0
                </button>
            </div>

            <style>{`
        @keyframes pulseGlow {
            0% { opacity: 0.3; transform: scale(0.95); }
            50% { opacity: 0.6; transform: scale(1.1); }
            100% { opacity: 0.3; transform: scale(0.95); }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
        </div>
    );
};
