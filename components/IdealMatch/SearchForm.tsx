'use client';

import { useState } from 'react';

interface SearchFormProps {
    onSearch: (birthDate: string, startYear: number, endYear: number) => void;
    isLoading: boolean;
}

export default function IdealMatchSearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [birthDate, setBirthDate] = useState('');
    const currentYear = new Date().getFullYear();
    const [yearRange, setYearRange] = useState(5);

    const handleSubmit = () => {
        if (!birthDate) {
            alert('Mohon masukkan tanggal lahir Anda');
            return;
        }

        const userBirthYear = new Date(birthDate).getFullYear();
        const startYear = userBirthYear - 5;
        const endYear = userBirthYear + 5;

        onSearch(birthDate, startYear, endYear);
    };

    const handleReset = () => {
        setBirthDate('');
        setYearRange(5);
    };

    return (
        <div className="max-w-2xl mx-auto slide-up delay-200">
            <div className="bg-surface-light p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200 border border-accent-gold/10">
                <div className="space-y-6">
                    <div className="space-y-3 text-left group">
                        <label htmlFor="birthDate" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-1">
                            Tanggal Lahir Anda
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">
                                calendar_month
                            </span>
                            <input
                                id="birthDate"
                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-stone-200 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 text-left">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-1">
                            Rentang Pencarian
                        </label>
                        <div className="bg-stone-50 rounded-2xl p-4">
                            <p className="text-sm text-stone-600 text-center">
                                ± {yearRange} tahun dari tahun lahir Anda
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full py-5 gradient-button text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <span className="material-symbols-outlined animate-spin">autorenew</span>
                        ) : (
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        )}
                        {isLoading ? 'Mencari Tanggal Ideal...' : 'Temukan Jodoh Ideal'}
                    </button>

                    {birthDate && (
                        <button
                            onClick={handleReset}
                            className="w-full py-3 text-stone-400 hover:text-primary transition-colors text-sm font-medium"
                        >
                            Reset Pencarian
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
