import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Admin testimonials load error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load testimonials.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("id" in body) ||
      typeof body.id !== "string" ||
      !("action" in body) ||
      (body.action !== "approve" && body.action !== "reject")
    ) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = await createAdminClient();

    if (body.action === "approve") {
      const { error } = await supabase
        .from("testimonials")
        .update({ approved: true })
        .eq("id", body.id)
        .eq("approved", false);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", body.id)
      .eq("approved", false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin testimonial update error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not update testimonial.",
      },
      { status: 500 },
    );
  }
}
