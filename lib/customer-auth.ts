import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizePhone, phoneToEmail, legacyEmail } from "@/lib/phone";

export type CreateResult = { ok: true; id: string } | { ok: false; error: string; status: number };

/** Creates a confirmed customer account (no email/SMS step). One account per phone number. */
export async function createCustomer(
  db: SupabaseClient,
  input: { name: string; phone: string; password: string },
): Promise<CreateResult> {
  const phone = normalizePhone(input.phone);
  const name = String(input.name ?? "").trim();
  if (!phone) return { ok: false, error: "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)", status: 400 };
  if (!name) return { ok: false, error: "আপনার নাম দিন", status: 400 };
  if (String(input.password ?? "").length < 6)
    return { ok: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", status: 400 };

  const { data: existing } = await db
    .from("customers")
    .select("id")
    .in("phone", [phone, `88${phone}`, `+88${phone}`])
    .limit(1);
  if (existing?.length) {
    return { ok: false, error: "এই নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে — লগইন করুন। পাসওয়ার্ড ভুলে গেলে আমাদের জানান।", status: 409 };
  }

  const { data, error } = await db.auth.admin.createUser({
    email: phoneToEmail(phone),
    password: input.password,
    email_confirm: true,
    user_metadata: { name, phone },
  });
  if (error || !data.user) {
    const dup = /already|registered|exists/i.test(error?.message ?? "");
    return {
      ok: false,
      status: dup ? 409 : 500,
      error: dup ? "এই নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে" : `অ্যাকাউন্ট তৈরি হয়নি: ${error?.message ?? "unknown"}`,
    };
  }

  // Make sure the profile row exists even if the DB trigger was never installed.
  await db.from("customers").upsert({ id: data.user.id, name, phone });
  return { ok: true, id: data.user.id };
}

export { legacyEmail };
