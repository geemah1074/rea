// Creates the Supabase client from config.js. The vendored UMD bundle
// (shared/vendor/supabase-2.45.4.js) must be loaded first; it defines window.supabase.

export function configProblem() {
  const c = window.MARQUEE_CONFIG;
  if (!c || !c.supabaseUrl || !c.supabaseAnonKey)
    return "shared/config.js is missing.";
  if (
    c.supabaseUrl.includes("YOUR-PROJECT-REF") ||
    c.supabaseAnonKey.startsWith("YOUR-")
  ) {
    return "shared/config.js still has placeholder values. Add the Supabase project URL and anon key.";
  }
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    return "The Supabase library did not load.";
  }
  return null;
}

export function makeClient(storageKey) {
  const c = window.MARQUEE_CONFIG;
  return window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey,
      detectSessionInUrl: false,
    },
    realtime: { params: { eventsPerSecond: 5 } },
  });
}

/** Turn a Supabase/PostgREST error into one readable sentence. */
export function errorText(error) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  return error.message || error.error_description || "Something went wrong.";
}
