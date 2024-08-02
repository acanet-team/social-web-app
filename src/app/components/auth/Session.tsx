"use client";

import { useAccessTokenStore } from "@/store/accessToken";
import useAuthStore from "@/store/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Session() {
  const { data: session } = useSession() as any;
  const createProfile = useAuthStore((state) => state.createProfile);
  const setAccessToken = useAccessTokenStore((s: any) => s.setAccessToken);
  const router = useRouter();

  useEffect(() => {
    console.log("aaaaaaaa", session);
    if (session) {
      createProfile(session);
      // console.log(session);
      if (!session.user.isProfile) {
        console.log("sessionnn", session);
        setAccessToken(session.token);
        router.push("/home");
      } else {
        router.push("/home");
      }
    }
  }, [session, setAccessToken]);

  return <></>;
}
