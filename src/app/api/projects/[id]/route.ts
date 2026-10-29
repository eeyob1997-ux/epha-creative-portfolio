import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth";

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    category: z.string().trim().min(1).max(80).optional(),
    image_url: z.string().trim().min(1).max(2000).optional(),
    published: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid project fields." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("projects")
      .update(parsed.data)
      .eq("id", id)
      .select("id, title, category, image_url, published")
      .maybeSingle();

    if (error) {
      console.error("Project update failed:", error.message);

      return NextResponse.json(
        { error: "Could not update project. Check database permissions." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Project not found or update not permitted." },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Project update error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Project deletion failed:", error.message);

      return NextResponse.json(
        { error: "Could not delete project. Check database permissions." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Project not found or deletion not permitted." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project deletion error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
