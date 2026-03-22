import supabase from "@/utils/supabase";

const USERS_TABLE = "users";
const HEARTBEAT_INTERVAL_MS = 60_000; // 1 minute

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

/** Update the user's online status and last_active_at timestamp */
async function updatePresence(
    firebaseUid: string,
    isOnline: boolean,
): Promise<void> {
    try {
        await supabase
            .from(USERS_TABLE)
            .update({
                is_online: isOnline,
                last_active_at: new Date().toISOString(),
            })
            .eq("firebase_uid", firebaseUid);
    } catch (err) {
        console.error("Failed to update presence:", err);
    }
}

/** Send a heartbeat to keep the user marked as online */
async function sendHeartbeat(firebaseUid: string): Promise<void> {
    await updatePresence(firebaseUid, true);
}

/** Start periodic heartbeat and register browser close/hide handlers */
export function startSessionTracking(firebaseUid: string): void {
    stopSessionTracking();

    // Immediately mark online
    sendHeartbeat(firebaseUid);

    // Periodic heartbeat every minute
    heartbeatTimer = setInterval(() => {
        sendHeartbeat(firebaseUid);
    }, HEARTBEAT_INTERVAL_MS);

    // Mark offline on tab close / navigate away
    const handleBeforeUnload = () => {
        // Use fetch with keepalive for reliable delivery during page unload
        // (sendBeacon doesn't support custom headers needed by Supabase)
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${USERS_TABLE}?firebase_uid=eq.${encodeURIComponent(firebaseUid)}`;

        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                Prefer: "return=minimal",
            },
            body: JSON.stringify({
                is_online: false,
                last_active_at: new Date().toISOString(),
            }),
            keepalive: true,
        }).catch(() => {
            // Best-effort — ignore errors during unload
        });
    };

    // Handle visibility change (tab switched / minimized)
    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            updatePresence(firebaseUid, false);
        } else if (document.visibilityState === "visible") {
            sendHeartbeat(firebaseUid);
        }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Store references for cleanup
    (window as any).__sessionCleanup = () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}

/** Stop heartbeat and remove browser event listeners */
export function stopSessionTracking(): void {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }

    if (typeof (window as any).__sessionCleanup === "function") {
        (window as any).__sessionCleanup();
        delete (window as any).__sessionCleanup;
    }
}

/** Explicitly mark a user offline (called on logout) */
export async function setUserOffline(firebaseUid: string): Promise<void> {
    stopSessionTracking();
    await updatePresence(firebaseUid, false);
}
