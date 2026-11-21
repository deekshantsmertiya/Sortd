import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle JSON payload: { fetchUrl: "https://..." }
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const fetchUrl = body?.fetchUrl?.trim();

      if (!fetchUrl) {
        return NextResponse.json({ error: "No fetchUrl provided" }, { status: 400 });
      }

      // Fetch the remote image
      const res = await fetch(fetchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch image from URL: ${res.statusText} (${res.status})` },
          { status: 400 }
        );
      }

      const mime = res.headers.get("content-type") || "";
      let ext = ".jpg";
      if (mime.includes("png")) ext = ".png";
      else if (mime.includes("webp")) ext = ".webp";
      else if (mime.includes("svg")) ext = ".svg";
      else if (mime.includes("gif")) ext = ".gif";

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `fetched-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    }

    // Handle standard FormData file upload
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique clean filename
    const sanitizedOriginalName = file.name.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "-");
    const filename = `${Date.now()}-${sanitizedOriginalName}`;
    const filePath = path.join(uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
