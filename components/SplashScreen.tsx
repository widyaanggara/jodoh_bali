import React from 'react';

const SplashScreen = ({ message = "Sedang Melakukan Perhitungan..." }: { message?: string }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-light/95 backdrop-blur-xl transition-all duration-500">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-8">
                {/* Logo or Icon Animation */}
                <div className="relative mb-8">
                    <img
                        src="/splash-logo.svg"
                        alt="Metemu Logo"
                        className="w-32 h-32 rounded-full shadow-2xl animate-bounce-slow relative z-10 object-cover p-1 bg-white"
                    />
                    {/* Ripple Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent-gold/20 rounded-full animate-pulse delay-150"></div>
                </div>

                <h2 className="font-display text-2xl font-bold text-stone-800 mb-2 animate-fade-in-up">
                    Metemu
                </h2>

                <p className="text-stone-500 font-medium animate-fade-in-up delay-100 mb-8">
                    {message}
                </p>

                {/* Loading Bar */}
                <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-linear-to-r from-primary to-accent-gold origin-left animate-progress-indeterminate"></div>
                </div>

                <p className="mt-8 text-xs text-stone-400 italic animate-fade-in-up delay-200">
                    "Menghubungkan Hati dengan Tradisi"
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;