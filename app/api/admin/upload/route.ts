import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

/** Generic file upload → Supabase Storage bucket "warranty-docs" → public URL. */
export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folder = String(form?.get("folder") ?? "misc").replace(/[^a-z0-9-]/gi, "");
  if (!(file instanceof File)) return NextResponse.json({ error: "ফাইল দিন" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "ফাইল ৮MB এর বেশি" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "শুধু ছবি বা PDF দেওয়া যাবে" }, { status: 400 });

  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await guard.db.storage
    .from("warranty-docs")
    .upload(path, await file.arrayBuffer(), { contentType: file.type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = guard.db.storage.from("warranty-docs").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
