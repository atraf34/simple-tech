/** Bangladeshi mobile → canonical 11-digit local form (01XXXXXXXXX), or null if invalid. */
export function normalizePhone(input: string): string | null {
  let d = String(input ?? "").replace(/[^\d+]/g, "").replace(/\+/g, "");
  if (d.startsWith("880")) d = d.slice(2);
  else if (d.startsWith("88") && d.length === 13) d = d.slice(2);
  if (/^1[3-9]\d{8}$/.test(d)) d = "0" + d;
  return /^01[3-9]\d{8}$/.test(d) ? d : null;
}

// Supabase Auth needs an email; we derive a private one from the phone number.
export const phoneToEmail = (canonicalPhone: string) => `${canonicalPhone}@phone.simpletech.app`;

// Accounts made by the old sign-up code used the 88-prefixed form.
export const legacyEmail = (canonicalPhone: string) => `88${canonicalPhone}@phone.simpletech.app`;
