
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { generateSessionID, saveToDatabase } from '@/lib/session';

interface SessionContextType {
    sessionID: string;
    recentDates: string[];
    logActivity: (featureName: string, inputDate: string, inputDate2?: string, birthTime?: string, birthTime2?: string) => Promise<void>;
    resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [sessionID, setSessionID] = useState<string>('');
    const [recentDates, setRecentDates] = useState<string[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Initialize session
    const startNewSession = useCallback(() => {
        const newID = generateSessionID();
        setSessionID(newID);
        setRecentDates([]);
        console.log(`[Session] Started new session: ${newID}`);
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            console.log("[Session] Auto-timeout reached. Resetting...");
            startNewSession();
        }, TIMEOUT_MS);
    }, [startNewSession]);

    // Initial load
    useEffect(() => {
        startNewSession();
        resetInactivityTimer();

        // Event listeners for activity tracking
        const handleActivity = () => resetInactivityTimer();

        window.addEventListener('mousedown', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('scroll', handleActivity);
        window.addEventListener('touchstart', handleActivity);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener('mousedown', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, [startNewSession, resetInactivityTimer]);

    const logActivity = async (featureName: string, inputDate: string, inputDate2?: string, birthTime?: string, birthTime2?: string) => {
        // Append to local Quick Pick list (keep last 3 unique)
        if (inputDate || inputDate2) {
            setRecentDates(prev => {
                let newRecent = [...prev];
                if (inputDate && !newRecent.includes(inputDate)) newRecent.unshift(inputDate);
                if (inputDate2 && !newRecent.includes(inputDate2)) newRecent.unshift(inputDate2);
                return newRecent.slice(0, 3);
            });
        }

        // Save to database
        await saveToDatabase({
            session_id: sessionID,
            feature_type: featureName,
            tanggal_lahir: inputDate,
            tanggal_lahir_2: inputDate2 || null,
            jam_lahir: birthTime || null,
            jam_lahir_2: birthTime2 || null
        });

        // Reset timer on explicit calculation action too
        resetInactivityTimer();
    };

    return (
        <SessionContext.Provider value={{ sessionID, recentDates, logActivity, resetSession: startNewSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
