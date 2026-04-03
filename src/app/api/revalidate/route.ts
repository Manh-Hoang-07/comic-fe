import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route để revalidate cache của system config
 * 
 * Sử dụng:
 * POST /api/revalidate
 * Body: { tag: "SystemConfig" } hoặc { tag: "SystemConfig-general" }
 * Headers: { "x-revalidate-secret": "your-secret-key" }
 */
export async function POST(request: NextRequest) {
    try {
        // Kiểm tra secret key để bảo mật
        const secret = request.headers.get("x-revalidate-secret");
        const expectedSecret = process.env.REVALIDATE_SECRET || "your-secret-key-here";

        if (secret !== expectedSecret) {
            return NextResponse.json(
                { success: false, message: "Invalid secret" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { tag } = body;

        if (!tag) {
            return NextResponse.json(
                { success: false, message: "Tag is required" },
                { status: 400 }
            );
        }

        // Revalidate cache theo tag
        revalidateTag(tag);

        return NextResponse.json({
            success: true,
            message: `Revalidated tag: ${tag}`,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}


