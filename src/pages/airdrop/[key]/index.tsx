import Header from "@/components/Header";
import React from "react";

function Otp() {
  return <div>Otp</div>;
}

export default Otp;
Otp.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
