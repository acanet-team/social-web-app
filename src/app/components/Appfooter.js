/* eslint-disable */

import Link from 'next/link';
import React from 'react';

export default function Appfooter() {
  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
      <Link href="/home" className="nav-content-bttn nav-center">
        <i className="feather-home"></i>
      </Link>
      <Link href="/defaultvideo" className="nav-content-bttn">
        <i className="feather-package"></i>
      </Link>
      <Link href="/defaultlive" className="nav-content-bttn" data-tab="chats">
        <i className="feather-layout"></i>
      </Link>
      <Link href="/shop2" className="nav-content-bttn">
        <i className="feather-layers"></i>
      </Link>
      <Link href="/defaultsettings" className="nav-content-bttn">
        <img
          src="assets/images/female-profile.png"
          alt="user"
          className="w30 shadow-xss"
        />
      </Link>
    </div>
  );
}
