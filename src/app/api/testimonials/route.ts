import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const testimonialSchema = z.object({
  client_name: z.string().trim().min(1).max(100),
  project_name: z.string().trim().min(1).max(150),
  feedback: z.string().trim().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
});

// Public visitors can see approved testimonials only.
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("testimonials")
      .select("id, client_name, project_name, feedback, rating, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Testimonials load error:", error.message);
      return NextResponse.json(
        { error: "Could not load testimonials." },
        { status: 500 },
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Testimonials API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

// Anyone can submit feedback, but it remains pending approval.
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Enter your name, project, feedback of 10–2000 characters, and a rating from 1 to 5.",
      },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("testimonials").insert({
      client_name: parsed.data.client_name,
      project_name: parsed.data.project_name,
      feedback: parsed.data.feedback,
      rating: parsed.data.rating,
      approved: false,
    });

    if (error) {
      console.error("Testimonials submission error:", error.message);
      return NextResponse.json(
        { error: "Could not submit feedback. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Thank you! Your feedback was submitted for review.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Testimonials submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
