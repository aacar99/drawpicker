import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const id = params?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "invalid_id", message: "id gerekli" },
        { status: 400 }
      );
    }

    // Basit UUID v4 kontrolü
    const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4.test(id)) {
      return NextResponse.json(
        { success: false, error: "invalid_id", message: "Geçersiz id formatı" },
        { status: 400 }
      );
    }

    // Sadece gerekli alanları seçerek performans iyileştirmesi
    const { data, error } = await supabase
      .from("draw_results")
      .select(
        `id, platform, input_url, source_url, tweet_url, input, url, title, author_name, author_username, author_avatar, total, winners, backups, cert_code, rules, created_at`
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, result: data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}