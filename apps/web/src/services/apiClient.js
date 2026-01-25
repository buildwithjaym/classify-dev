import { API_BASE_URL } from "../config/env";

export async function apiGet(path) {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
    }
    return res.json();
}
