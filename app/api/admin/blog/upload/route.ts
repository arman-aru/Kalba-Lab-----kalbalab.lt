import sharp from "sharp";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  let form: FormData;
  try { form = await req.formData(); }
  catch { return Response.json({ error: "Invalid form data" }, { status: 400 }); }

  const file = form.get("file");
  const alt = String(form.get("alt") ?? "").trim();

  if (!(file instanceof File)) return Response.json({ error: "Missing file" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "File exceeds 8 MB" }, { status: 413 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "Not an image" }, { status: 400 });
  if (alt.length < 4) return Response.json({ error: "Alt text required (≥4 chars)" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());

  let webp: Buffer;
  let width = 0;
  let height = 0;
  try {
    const pipeline = sharp(buf).rotate();
    const meta = await pipeline.metadata();
    width = meta.width ?? 0;
    height = meta.height ?? 0;
    webp = await pipeline
      .resize({ width: Math.min(width || 1920, 1920), withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const out = await sharp(webp).metadata();
    width = out.width ?? width;
    height = out.height ?? height;
  } catch {
    return Response.json({ error: "Could not process image" }, { status: 400 });
  }

  const key = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.webp`;
  const sb = getSupabaseAdmin();
  const { error: upErr } = await sb.storage
    .from("blog-media")
    .upload(key, webp, { contentType: "image/webp", upsert: false, cacheControl: "31536000" });

  if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

  const { data: pub } = sb.storage.from("blog-media").getPublicUrl(key);

  return Response.json({
    url: pub.publicUrl,
    width,
    height,
    alt,
    key,
  });
}
