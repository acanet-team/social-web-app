/* eslint-disable */
import React, { Fragment } from "react";

export default function Login() {
  return (
    <div className="main-wrap">
      <div className="nav-header border-0 bg-transparent shadow-none">
        <div className="nav-top w-100">
          <a href="/">
            <i className="feather-zap text-success display1-size me-2 ms-0" />
            <span className="d-inline-block fredoka-font ls-3 fw-600 font-xxl logo-text mb-0 text-current">
              Sociala.{' '}
            </span>{' '}
          </a>
          <button
            className="nav-menu me-0 ms-auto"
            title="Menu"
            type="button"
            aria-label="Menu"
          />

          <a
            href="/login"
            className="header-btn d-none d-lg-block bg-dark fw-500 font-xsss w100 lh-20 ms-auto rounded-xl p-3 text-center text-white"
          >
            Login
          </a>
          <a
            href="/register"
            className="header-btn d-none d-lg-block fw-500 font-xsss w100 lh-20 ms-2 rounded-xl bg-current p-3 text-center text-white"
          >
            Register
          </a>
        </div>
      </div>
      <div className="row">
        <div
          className="col-xl-5 d-none d-xl-block vh-100 bg-image-cover bg-no-repeat p-0"
          style={{
            backgroundImage: `url("https://via.placeholder.com/800x950.png")`,
          }}
        />
        <div className="col-xl-7 vh-100 align-items-center d-flex rounded-3 overflow-hidden bg-white">
          <div className="card login-card me-auto ms-auto border-0 shadow-none">
            <div className="card-body rounded-0 text-left">
              <h2 className="fw-700 display1-size display2-md-size mb-3">
                Login into <br />
                your account
              </h2>

              <div className="col-sm-12 p-0 text-left">
                <div className="form-group mb-1">
                  <a
                    href="/login"
                    className="form-control style2-input fw-600 bg-dark border-0 p-0 text-center text-white "
                  >
                    Login
                  </a>
                </div>
                <h6 className="text-grey-500 font-xsss fw-500 lh-32 my-0">
                  Dont have account{' '}
                  <a href="/register" className="fw-700 ms-1">
                    Register
                  </a>
                </h6>
              </div>
              <div className="col-sm-12 mt-2 p-0 text-center">
                <h6 className="d-inline-block fw-500 font-xsss text-grey-500 mb-3 bg-white">
                  Or, Sign in with your social account{' '}
                </h6>
                <div className="form-group mb-1">
                  <a
                    href="/register"
                    className="form-control style2-input fw-600 bg-facebook mb-2 border-0 p-0 text-left text-white"
                  >
                    <img
                      src="assets/images/icon-1.png"
                      alt="icon"
                      className="w40 mb-1 me-5 ms-2"
                    />{' '}
                    Sign in with Google
                  </a>
                </div>
                <div className="form-group mb-1">
                  <a
                    href="/register"
                    className="form-control style2-input fw-600 bg-twiiter border-0 p-0 text-left text-white "
                  >
                    <img
                      src="assets/images/icon-3.png"
                      alt="icon"
                      className="w40 mb-1 me-5 ms-2"
                    />{' '}
                    Sign in with Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
