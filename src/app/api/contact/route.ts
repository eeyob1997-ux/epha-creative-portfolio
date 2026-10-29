import { isRateLimited } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(5).max(3000),
});

export async function POST(request: Request) {
  const clientIp = "local-development";

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in one minute." },
      { status: 429 },
    );
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

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid name, email and message." },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    console.error("Supabase contact insert failed:", error.message);

    return NextResponse.json(
      {
        error:
          "Messages are temporarily unavailable. Please email us directly.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}



