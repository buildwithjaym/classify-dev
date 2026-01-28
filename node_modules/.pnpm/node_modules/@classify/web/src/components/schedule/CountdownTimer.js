export function getCountdownLabel(startISO, endISO) {
    const now = new Date();
    const start = new Date(startISO);
    const end = new Date(endISO);

    if (now < start) {
        const diff = start - now;
        return `Starts in ${formatMs(diff)}`;
    }
    if (now >= start && now <= end) {
        const diff = end - now;
        return `Ongoing • ends in ${formatMs(diff)}`;
    }
    return "Ended";
}

function formatMs(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}
