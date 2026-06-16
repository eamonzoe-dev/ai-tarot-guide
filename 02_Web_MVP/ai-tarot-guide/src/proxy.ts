import { NextRequest, NextResponse } from "next/server";

const ROBOTS_HEADER_VALUE = "noindex, nofollow";

function withRobotsHeader(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", ROBOTS_HEADER_VALUE);
  return response;
}

function unauthorizedResponse(): NextResponse {
  const response = new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Site Lock", charset="UTF-8"',
      "X-Robots-Tag": ROBOTS_HEADER_VALUE,
    },
  });

  return response;
}

function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const maxLength = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;

  for (let i = 0; i < maxLength; i += 1) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }

  return diff === 0;
}

function isAuthorized(request: NextRequest): boolean {
  const username = process.env.SITE_LOCK_USERNAME;
  const password = process.env.SITE_LOCK_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  let credentials: string;

  try {
    credentials = atob(authorization.slice("Basic ".length));
  } catch {
    return false;
  }

  const separatorIndex = credentials.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  const providedUsername = credentials.slice(0, separatorIndex);
  const providedPassword = credentials.slice(separatorIndex + 1);

  return (
    timingSafeEqual(providedUsername, username) &&
    timingSafeEqual(providedPassword, password)
  );
}

export function proxy(request: NextRequest): NextResponse {
  if (process.env.SITE_LOCK_ENABLED !== "true") {
    return withRobotsHeader(NextResponse.next());
  }

  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  return withRobotsHeader(NextResponse.next());
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)",
  ],
};
