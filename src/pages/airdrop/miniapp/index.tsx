import React from "react";
import styles from "@/styles/modules/claim.module.scss";
import Image from "next/image";
import Header from "@/components/Header";
function SwitchMiniapp() {
  return (
    <div className={`pb-5 ${styles["card-claim"]}`}>
      <div
        className={`d-flex flex-column justify-content-center align-items-center`}
      >
        <Image
          src={`/assets/images/img-switch-miniapp.svg`}
          width={298}
          height={256}
          alt="img-switch-miniapp"
        />
        <p className="font-lg fw-700 mt-2 text-center">
          Acanet Airdrop Program
        </p>
        <p className="font-md mt-3 mb-3 fw-400 text-center px-2">
          Looks like you haven’t connected with our Telegram Mini app
        </p>
        <div className={`position-relative ${styles["group"]}`}>
          <Image
            src={`/assets/images/bg-mesh-111.svg`}
            // src={`/asset/images/img-switch-miniapp.svg`}
            width={20}
            height={20}
            alt="img-switch-miniapp"
            className={`me-2 ${styles["image-switch-miniapp"]} position-absolute`}
          />
          <div className={`${styles["group-text"]} position-absolute`}>
            <p className={`mb-0 mx-2 my-1  ${styles["text-group"]}`}>
              <Image
                src={`/assets/images/Checkboxes-switch-miniapp.svg`}
                // src={`/asset/images/img-switch-miniapp.svg`}
                width={20}
                height={20}
                alt="img-switch-miniapp"
                className={`me-2 `}
              />
              Click button below to join our Miniapp{" "}
            </p>
            <p className={`mb-0 mx-2 my-1  ${styles["text-group"]}`}>
              <Image
                src={`/assets/images/Checkboxes-switch-miniapp.svg`}
                // src={`/asset/images/img-switch-miniapp.svg`}
                width={20}
                height={20}
                alt="img-switch-miniapp"
                className={`me-2`}
              />
              Select tab Claim{" "}
            </p>
            <p className={`mb-0 mx-2 my-1 ${styles["text-group"]}`}>
              <Image
                src={`/assets/images/Checkboxes-switch-miniapp.svg`}
                // src={`/asset/images/img-switch-miniapp.svg`}
                width={20}
                height={20}
                alt="img-switch-miniapp"
                className={`me-2`}
              />
              Click Connect{" "}
            </p>
          </div>
        </div>

        {/* <div className={`${styles["bg-image-switch-miniapp"]} mt-4 py-3 px-2`}>
          <p className="font-xss mb-0 mx-2">
            <Image
              src={`/assets/images/Checkboxes-switch-miniapp.svg`}
              // src={`/asset/images/img-switch-miniapp.svg`}
              width={20}
              height={20}
              alt="img-switch-miniapp"
              className={`me-2 `}
            />
            Click button below to join our Miniapp{" "}
          </p>
          <p className="font-xss mb-0 mx-2">
            <Image
              src={`/assets/images/Checkboxes-switch-miniapp.svg`}
              // src={`/asset/images/img-switch-miniapp.svg`}
              width={20}
              height={20}
              alt="img-switch-miniapp"
              className={`me-2`}
            />
            Select tab Claim{" "}
          </p>
          <p className="font-xss mb-0 mx-2">
            <Image
              src={`/assets/images/Checkboxes-switch-miniapp.svg`}
              // src={`/asset/images/img-switch-miniapp.svg`}
              width={20}
              height={20}
              alt="img-switch-miniapp"
              className={`me-2`}
            />
            Click Connect{" "}
          </p>
        </div> */}
        <button
          onClick={() => ""}
          className={`${styles["button-claim"]} py-1 px-5 text-white font-md mt-5`}
        >
          Visit Telegram Miniapp
        </button>
      </div>
    </div>
  );
}

export default SwitchMiniapp;

SwitchMiniapp.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};
