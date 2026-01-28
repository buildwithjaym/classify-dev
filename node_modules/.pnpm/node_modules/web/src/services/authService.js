import { supabase } from "../config/supabaseClient";


export function toLoginEmail(id) {
    const trimmed = (id || "").trim();
    if (!trimmed) return "";
    if (trimmed.includes("@")) return trimmed;
    return `${trimmed}@classify.local`;
}

export async function signInWithIdPassword(idOrEmail, password) {
    const email = toLoginEmail(idOrEmail);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
}
