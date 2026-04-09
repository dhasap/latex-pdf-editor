import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  console.log("[COMPILE] Request received - using GET API workaround");

  try {
    // Parse request body to get LaTeX code
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("[COMPILE] Failed to parse JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Extract LaTeX content from resources
    const resources = body.resources || [];
    const mainResource = resources.find((r: { main?: boolean; content?: string }) => r.main) || resources[0];

    if (!mainResource || !mainResource.content) {
      return NextResponse.json(
        { error: "Missing LaTeX content" },
        { status: 400 }
      );
    }

    const latexContent = mainResource.content;
    const compiler = body.compiler || "pdflatex";

    // Build GET URL with query parameters
    const baseUrl = "https://latex.ytotech.com/builds/sync";
    const params = new URLSearchParams();
    params.append("content", latexContent);
    params.append("compiler", compiler);

    const url = `${baseUrl}?${params.toString()}`;
    console.log("[COMPILE] Calling GET API with URL length:", url.length);

    // Call the GET API
    let response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/pdf, */*",
        },
      });
      console.log("[COMPILE] LaTeX API responded with status:", response.status);
    } catch (fetchError) {
      console.error("[COMPILE] Fetch failed:", fetchError);
      return NextResponse.json(
        { error: `Network error connecting to LaTeX API: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}` },
        { status: 502 }
      );
    }

    // Handle error response
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error("[COMPILE] LaTeX API error response:", errorText.substring(0, 500));
      } catch {
        errorText = "Unknown error";
      }

      return NextResponse.json(
        { error: `LaTeX API error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    // Get the response as array buffer
    console.log("[COMPILE] Reading response body...");
    let pdfBuffer;
    try {
      pdfBuffer = await response.arrayBuffer();
      console.log("[COMPILE] PDF buffer received, size:", pdfBuffer.byteLength);
    } catch (bufferError) {
      console.error("[COMPILE] Failed to read buffer:", bufferError);
      return NextResponse.json(
        { error: `Failed to read PDF response: ${bufferError instanceof Error ? bufferError.message : "Unknown error"}` },
        { status: 500 }
      );
    }

    // Return PDF with proper headers
    console.log("[COMPILE] Returning PDF response");
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=document.pdf",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error) {
    console.error("[COMPILE] Unexpected error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
