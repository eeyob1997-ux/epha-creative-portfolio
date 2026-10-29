import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth";

const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }

  const extension = allowedTypes.get(file.type);

  if (!extension) {
    return NextResponse.json(
      { error: "Use a PNG, JPG, WEBP, or GIF image." },
      { status: 400 },
    );
  }

  if (file.size > maxFileSize) {
    return NextResponse.json(
      { error: "Images must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const bucket = "portfolio-images";
  const path = `${crypto.randomUUID()}.${extension}`;

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      const errorMessage = error.message.toLowerCase();
      const isMissingBucket =
        error.statusCode === "404" || errorMessage.includes("bucket not found");
      const isPermissionError =
        errorMessage.includes("row-level security") ||
        errorMessage.includes("permission denied") ||
        errorMessage.includes("unauthorized");

      const hint = isMissingBucket
        ? `Create a public "${bucket}" bucket in Supabase Storage.`
        : isPermissionError
          ? `Allow the signed-in admin user to upload to the "${bucket}" bucket in Supabase Storage policies.`
          : "";

      console.error(`Project image upload failed for bucket "${bucket}":`, {
        message: error.message,
        statusCode: error.statusCode,
      });
      return NextResponse.json(
        {
          error: [
            `Could not upload image to bucket "${bucket}": ${error.message}`,
            hint,
          ]
            .filter(Boolean)
            .join(" "),
        },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ image_url: data.publicUrl });
  } catch (error) {
    console.error("Project image upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while uploading the image.",
      },
      { status: 500 },
    );
  }
}
