import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// URL length limit constants
const MAX_URL_LENGTH = 8000; // Safe limit for most browsers/servers
const MAX_CONTENT_LENGTH = 6000; // Leave room for other params

export async function POST(request: NextRequest) {
  console.log("[COMPILE] Request received");

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

    // Check content length before attempting to send
    if (latexContent.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        {
          error: `Document too large (${latexContent.length} characters). Maximum allowed is ${MAX_CONTENT_LENGTH} characters due to API limitations.`,
          code: "CONTENT_TOO_LARGE"
        },
        { status: 413 }
      );
    }

    // Build GET URL with query parameters
    const baseUrl = "https://latex.ytotech.com/builds/sync";
    const params = new URLSearchParams();
    params.append("content", latexContent);
    params.append("compiler", compiler);

    const url = `${baseUrl}?${params.toString()}`;

    // Check URL length
    if (url.length > MAX_URL_LENGTH) {
      return NextResponse.json(
        {
          error: `Generated URL too long (${url.length} chars). Maximum allowed is ${MAX_URL_LENGTH} characters.`,
          code: "URL_TOO_LONG"
        },
        { status: 414 }
      );
    }

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

    // Validate PDF magic bytes
    const pdfHeader = new Uint8Array(pdfBuffer.slice(0, 5));
    const isValidPdf = pdfHeader[0] === 0x25 && // %
                       pdfHeader[1] === 0x50 && // P
                       pdfHeader[2] === 0x44 && // D
                       pdfHeader[3] === 0x46;   // F

    if (!isValidPdf) {
      // Try to parse as error text
      const textDecoder = new TextDecoder();
      const text = textDecoder.decode(pdfBuffer);
      console.error("[COMPILE] Invalid PDF received:", text.substring(0, 500));
      return NextResponse.json(
        { error: `API returned invalid PDF. Response: ${text.substring(0, 200)}` },
        { status: 502 }
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
