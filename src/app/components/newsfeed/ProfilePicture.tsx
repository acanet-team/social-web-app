import Image from "next/image";
import { useState, useEffect } from "react";

const ProfilePicture = ({ url }: { url: string }) => {
  return url && url.includes("platform-lookaside.fbsbx.com") ? (
    <img
      src={url}
      width={30}
      height={30}
      crossOrigin="anonymous"
      className="shadow-sm rounded-circle w30"
    />
  ) : (
    <Image
      src={url}
      alt="Ảnh hồ sơ"
      width={30}
      height={30}
      className="shadow-sm rounded-circle w30"
    />
  );
};

export default ProfilePicture;
