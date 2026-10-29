import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth";

const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  image_url: z.string().trim().min(1).max(2000),
  published: z.boolean().default(false),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authorized = await isAdmin();
    const supabase = authorized
      ? await createAdminClient()
      : await createClient();

    let query = supabase
      .from("projects")
      .select("id, title, category, image_url, published")
      .order("title", { ascending: true });

    // Public visitors only see published projects.
    if (!authorized) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to load projects:", error.message);
      return NextResponse.json(
        { error: "Could not load projects." },
        { status: 500 },
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the project fields." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: parsed.data.title,
        category: parsed.data.category,
        image_url: parsed.data.image_url,
        published: parsed.data.published,
      })
      .select("id, title, category, image_url, published")
      .single();

    if (error) {
      console.error("Failed to save project:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        {
          error: `Could not save project${error.code ? ` (${error.code})` : ""}: ${error.message}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
