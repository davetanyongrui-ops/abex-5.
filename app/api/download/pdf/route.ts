import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pdfUrl = searchParams.get("url");

    if (!pdfUrl) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error("Failed to fetch PDF");

        const blob = await response.blob();
        
        // Extract filename from URL or use a default
        const fileName = pdfUrl.split('/').pop() || 'product-manual.pdf';

        return new NextResponse(blob, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${fileName}"`,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("PDF download proxy error:", error);
        return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 });
    }
}
