import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8081",
  "https://myhouz.vercel.app",
];

const ALLOWED_METHODS = "GET, POST, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS = "Authorization, Content-Type";

function getOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return null;
}

export function setCorsHeaders(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  const origin = getOrigin(request);
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
    response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    response.headers.set("Access-Control-Max-Age", "86400");
  }
  return response;
}

export function handlePreflight(request: NextRequest): NextResponse {
  const origin = getOrigin(request);
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...(origin
        ? {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": ALLOWED_METHODS,
            "Access-Control-Allow-Headers": ALLOWED_HEADERS,
            "Access-Control-Max-Age": "86400",
          }
        : {}),
    },
  });
}
