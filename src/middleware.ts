import { getSession } from "next-auth/react";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import httpClient from "./api";
import { ONBOARDING_STEP, type ISession } from "./api/auth/auth.model";

export async function middleware(request: NextRequest) {
  const requestForNextAuth = {
    headers: {
      cookie: request.headers.get("cookie"),
    },
  };
  const session = (await getSession({
    req: requestForNextAuth as any,
  })) as unknown as ISession;

  if (!session || session.needToLogin) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
  if (session.user.onboarding_data?.step !== ONBOARDING_STEP.COMPLETE) {
    return NextResponse.redirect(
      new URL("/onboarding", request.nextUrl.origin),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
