/* eslint-disable @typescript-eslint/no-explicit-any */
export const input = "rounded-full bg-surface-lowest border border-outline-soft px-3 py-2 text-body-md w-full";
export const area = "rounded-lg bg-surface-lowest border border-outline-soft px-3 py-2 text-body-md w-full";
export const btn = "btn-cyan px-4 py-2 text-body-sm font-medium";
export const btnGhost = "btn-violet px-4 py-2 text-body-sm font-medium";
export const danger = "rounded-full border border-red-200 text-red-600 px-3 py-1.5 text-body-sm hover:bg-red-50";

export async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "ব্যর্থ হয়েছে");
  return json;
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "আপলোড ব্যর্থ");
  return json.url;
}
