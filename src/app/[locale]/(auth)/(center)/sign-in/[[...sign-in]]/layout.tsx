'use client';

import type { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import useAuthStore from '@/store/auth';
import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const LoginPage: NextPage = () => {
  const login = useAuthStore((state: any) => state.login);
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      login(null, session);
    }
  }, [session, login]);

  const t = useTranslations('SignIn');

  return (
    <div className="main-wrap">
      <div className="nav-header border-0 bg-transparent shadow-none">
        <div className="nav-top w-100">
          <a
            href="/"
            className="me-auto d-flex justify-content-center align-items-center"
          >
            <span
              id="site-logo"
              className="d-inline-block fredoka-font ls-3 fw-600 font-xxl logo-text mb-0 text-current"
            >
              <Image
                src="/assets/images/logo/logo-horizontal-white.png"
                width={220}
                height={60}
                style={{ width: 'auto', height: '60px' }}
                alt="logo"
              />
            </span>{' '}
          </a>
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
                {t('sign_in_with')} <br />
                {t('your_social_account')}
              </h2>
              <div className="col-sm-12 mt-2 p-0 text-center">
                <div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Google"
                    title="Sign in with Google"
                    className="form-control style2-input fw-600 bg-twiiter border-0 p-0 text-left text-white "
                    onClick={() => signIn('google')}
                  >
                    <Image
                      width={40}
                      height={40}
                      src="/assets/images/icon-1.png"
                      alt="icon"
                      className="w40 mb-1 me-5 ms-2"
                    />{' '}
                    {t('sign_in_with_google')}
                  </button>
                </div>
                <div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Facebook"
                    title="Sign in with Facebook"
                    className="form-control style2-input fw-600 bg-twiiter border-0 p-0 text-left text-white "
                    onClick={() => signIn('facebook')}
                  >
                    <Image
                      src="/assets/images/icon-3.png"
                      alt="icon"
                      width={40}
                      height={40}
                      className="w40 mb-1 me-5 ms-2"
                    />{' '}
                    {t('sign_in_with_facebook')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
