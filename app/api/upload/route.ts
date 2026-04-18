// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/auth/auth-session";
import cloudinary from "@/lib/cloudinary";


export async function POST(req: NextRequest) {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
            { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
            { status: 400 }
        );
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        return NextResponse.json(
            { error: "File too large. Maximum size is 5MB." },
            { status: 400 }
        );
    }

    // convert File -> buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        // Upload with automatic optimization transformations
        // This optimizes the image on upload: converts to best format, compresses, etc.
        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "listings",
                    // Automatic format selection (uses WebP/AVIF when supported)
                    transformation: [
                        {
                            fetch_format: "auto",
                            quality: "auto"
                        },
                    ],
                    // Generate responsive breakpoints
                    responsive_breakpoints: [
                        {
                            create_derived: true,
                            min_width: 320,
                            max_width: 1280,
                            bytes_step: 20000,
                            min_bytes: 15000,
                            max_images: 5,
                        },
                    ],
                },
                (err, res) => (err ? reject(err) : resolve(res!))
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: uploadResult.secure_url });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
