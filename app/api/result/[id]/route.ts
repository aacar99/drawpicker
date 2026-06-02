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

    const { data, error } = await supabase
      .from("draw_results")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}