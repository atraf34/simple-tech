/** Strip characters that have meaning inside PostgREST filter strings. */
export const safeSearch = (q: string | null) =>
  (q ?? "").replace(/[,()%*\\]/g, " ").trim().slice(0, 60);
