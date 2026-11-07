

/**
 * Generate a short unique ID (9-10 chars)
 */
export function generateSessionID(): string {
    return Math.random().toString(36).substring(2, 11).toUpperCase();
}

export interface VisitorActivity {
    session_id: string;
    feature_type: string;
    tanggal_lahir: string;
    tanggal_lahir_2: string | null;
    jam_lahir?: string | null;
    jam_lahir_2?: string | null;
}

/**
 * Append-only activity log to Firestore
 */
export async function saveToDatabase(activity: VisitorActivity) {
    // Release gate: legacy activity collection is deferred; calculations remain local.
    void activity;
}
