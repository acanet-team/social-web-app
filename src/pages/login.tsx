import { ONBOARDING_STEP } from "@/api/auth/auth.model";
import { useLoading } from "@/context/Loading/context";
import useAuthStore from "@/store/auth";
import type { NextPageContext } from "next";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { NextPageWithLayout } from "./_app";
import { useGuestToken } from "@/context/guestToken";
import { LoginButton } from "@telegram-auth/react";
import { generate_pkce_codes, generate_state_param } from "@/utils/zaloOauth";
import { generateCodeChallenge } from "@/utils";

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const t = useTranslations("SignIn");
  const [curTheme, setCurTheme] = useState("theme-light");
  const [zaloCode, setZaloCode] = useState("");
  const { data: session, update } = useSession() as any;
  const { showLoading } = useLoading();
  // Zustand store
  const { createProfile, login, checkOnboarding } = useAuthStore(
    (state) => state,
  );
  const { guestToken, setGuestToken } = useGuestToken() || {};

  useEffect(() => {
    const handleStorageChange = () => {
      const theme = localStorage.getItem("theme") || "theme-light";
      setCurTheme(theme);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleZaloLogin = () => {
    showLoading();
    const state = generate_state_param();
    const code = generate_pkce_codes();
    const codeVerifier = code.verifier;
    localStorage.setItem("zalo_code_verifier", codeVerifier);
    let authUri =
      `https://oauth.zaloapp.com/v4/permission` +
      "?" +
      new URLSearchParams({
        app_id: process.env.NEXT_PUBLIC_APP_ID || "1424978791068098776",
        redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN}`,
        code_challenge: generateCodeChallenge(codeVerifier),
        state: state,
      }).toString();

    // Chuyển người dùng tới trang Zalo để đăng nhập
    window.location.replace(authUri);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setZaloCode(queryParams.get("code") || zaloCode);

    if (zaloCode) {
      // Thực hiện đăng nhập với mã zaloCode và codeVerifier
      const codeVerifier = localStorage.getItem("zalo_code_verifier");
      if (codeVerifier) {
        signIn(
          "zalo-login",
          {
            callbackUrl: "/",
          },
          {
            code: zaloCode,
            codeVerifier,
          },
        );
      }
    }
  }, [zaloCode]);

  useEffect(() => {
    if (session) {
      // Navigation
      const onboardingStep = session.user["onboarding_data"]?.step;
      if (onboardingStep !== ONBOARDING_STEP.COMPLETE) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    }
  }, [session]);

  const onSignInAsGuestHandler = async (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      showLoading();
      await signIn("credentials", {}, {});
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="main-wrap">
      {/* <Session /> */}
      <div className="nav-header border-0 bg-transparent shadow-none">
        <div className="nav-top w-100">
          <Link href="/" className="me-auto">
            <span
              id="site-logo"
              className="d-inline-block fredoka-font ls-3 fw-600 font-xxl logo-text mb-0 text-current"
            >
              <Image
                src={
                  curTheme === "theme-dark"
                    ? "/assets/images/logo/logo-horizontal-white.png"
                    : "/assets/images/logo/logo-horizontal-dark.png"
                }
                width={220}
                height={60}
                style={{ width: "auto", height: "60px" }}
                alt="logo"
              />
            </span>
          </Link>
          <button
            className="nav-menu me-0 ms-auto"
            title="Menu"
            type="button"
            aria-label="Menu"
          />
        </div>
      </div>
      <div className="row">
        <div
          className="col-xl-5 d-none d-xl-block vh-100 bg-image-cover bg-no-repeat p-0"
          style={{
            backgroundImage: `url("../assets/images/login-bg.jpg")`,
          }}
        />
        <div className="col-xl-7 vh-100 align-items-center d-flex rounded-3 overflow-hidden bg-white">
          <div className="card login-card me-auto ms-auto border-0 shadow-none">
            <div className="card-body rounded-0 text-left">
              <h2 className="fw-700 display1-size display2-md-size mb-3">
                {t("sign_in_with")} <br />
                {t("your_social_account")}
              </h2>
              <div className="col-sm-12 mt-2 p-0 text-center">
                <div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Google"
                    title="Sign in with Google"
                    className="form-control style2-input fw-600 bg-twiiter border-0 p-0 text-left text-white "
                    onClick={() => {
                      showLoading();
                      signIn("google", { callbackUrl: "/" });
                    }}
                  >
                    <Image
                      width={40}
                      height={40}
                      src="/assets/images/icon-1.png"
                      alt="icon"
                      className="w40 mb-1 me-5 ms-2"
                    />{" "}
                    {t("sign_in_with_google")}
                  </button>
                </div>
                <div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Facebook"
                    title="Sign in with Facebook"
                    className="form-control style2-input fw-600 bg-facebook border-0 p-0 text-left text-white "
                    onClick={() => {
                      showLoading();
                      signIn("facebook", { callbackUrl: "/" });
                    }}
                  >
                    <Image
                      src="/assets/images/icon-3.png"
                      alt="icon"
                      width={40}
                      height={40}
                      className="w40 mb-1 me-5 ms-2"
                    />{" "}
                    {t("sign_in_with_facebook")}
                  </button>
                </div>
                {/**<div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Zalo"
                    title="Sign in with Zalo"
                    className="form-control style2-input fw-600 bg-linkedin border-0 p-0 text-left text-white "
                    onClick={handleZaloLogin}
                  >
                    <Image
                      src="/assets/images/icons8-zalo-48.png"
                      alt="icon"
                      width={40}
                      height={40}
                      className="w40 mb-1 me-5 ms-2"
                    />{" "}
                    {t("sign_in_with_zalo")}
                  </button>
                </div> */}
                <div className="form-group mb-1">
                  {/* <button
                    type="button"
                    aria-label="Sign in with Telegram"
                    title="Sign in with Telegram"
                    className="form-control style2-input fw-600 bg-twiiter border-0 p-0 text-left text-white "
                    onClick={() => {
                      showLoading();
                      signIn("telegram-login", { callbackUrl: "/" }, {});
                    }}
                  >
                    <Image
                      width={40}
                      height={40}
                      src="/assets/images/icon-1.png"
                      alt="icon"
                      className="w40 mb-1 me-5 ms-2"
                    />{" "}
                    {t("sign_in_with_telegram")}
                  </button>
                   */}
                  <LoginButton
                    botUsername={"pi_mob_bot"}
                    showAvatar={false}
                    requestAccess={null}
                    onAuthCallback={(data) => {
                      signIn(
                        "telegram-login",
                        { callbackUrl: "/" },
                        data as any,
                      );
                    }}
                  />
                </div>
              </div>
              <div
                onClick={onSignInAsGuestHandler}
                className="text-center mt-3 cursor-pointer"
              >
                Sign in as guest
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

LoginPage.getLayout = function getLayout(page: any) {
  return <>{page}</>;
};

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
