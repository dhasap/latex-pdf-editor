import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  console.log("[COMPILE] Request received");

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("[COMPILE] Request body parsed:", JSON.stringify(body).substring(0, 200));
    } catch (e) {
      console.error("[COMPILE] Failed to parse JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.compiler || !body.resources) {
      console.error("[COMPILE] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: compiler, resources" },
        { status: 400 }
      );
    }

    // Forward to LaTeX API
    console.log("[COMPILE] Calling latex.ytotech.com...");
    let response;
    try {
      response = await fetch("https://latex.ytotech.com/builds/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/pdf, application/json, text/plain, */*",
        },
        body: JSON.stringify(body),
      });
      console.log("[COMPILE] LaTeX API responded with status:", response.status);
    } catch (fetchError) {
      console.error("[COMPILE] Fetch failed:", fetchError);
      return NextResponse.json(
        { error: `Network error connecting to LaTeX API: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}` },
        { status: 502 }
      );
    }

    // Handle error response from LaTeX API
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error("[COMPILE] LaTeX API error response:", errorText.substring(0, 500));
      } catch {
        errorText = "Unable to read error response";
      }

      return NextResponse.json(
        { error: `LaTeX API error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    // Get the response as array buffer (more reliable than blob in Edge Runtime)
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
    // Catch-all for unexpected errors
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
