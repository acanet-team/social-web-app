import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ONBOARDING_STEP } from "./api/auth/auth.model";

export async function middleware(request: NextRequest) {
  const requestForNextAuth = {
    headers: {
      cookie: request.headers.get("cookie"),
    },
  };
  // const session = (await getSession({
  //   req: requestForNextAuth as any,
  // })) as unknown as ISession;

  const session = (await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  })) as any;

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
  runtime: "nodejs", // rather than "edge"
  unstable_allowDynamic: [
    "/node_modules/@babel/runtime/regenerator/index.js", // file causing the build error
  ],
};
