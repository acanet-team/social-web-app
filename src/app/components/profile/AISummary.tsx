import React from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";

const AiSummary = ({ role }: { role: boolean }) => {
  return (
    <div
      className="card p-4"
      style={{
        background: "#FFFFFF",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRadius: "15px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2px",
        }}
      >
        <p className="m-0 fw-700 font-xsss">AI summary</p>
        <Image
          src="/assets/images/profile/icons8-lightning-96 1.png"
          width={25}
          height={25}
          alt=""
          className=""
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <p className="m-0 fw-400 font-xsss">
        Diep Kieu Trang is a seasoned tech entrepreneur and executive with
        extensive experience leading major technology companies. She is known
        for her expertise in business strategy, leadership, and fostering
        innovation.{" "}
      </p>
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #d1d1d1",
          marginTop: "20px",
        }}
      />
      <div className="mb-2">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="m-0 fw-700 font-xssss">Contact</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Image
              src="/assets/images/profile/icons8-plus-100 3.png"
              width={25}
              height={25}
              alt=""
              className=""
              style={{
                objectFit: "cover",
              }}
            /> */}
            {role === true && (
              <>
                <h1>
                  <i className={`bi bi-plus-lg ${styles["icon-profile"]}`}></i>
                </h1>
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                  ></i>
                </h4>
              </>
            )}
            {/* <Image
              src="/assets/images/profile/icons8-edit-100 6.png"
              width={15}
              height={15}
              alt=""
              className=""
              style={{
                objectFit: "cover",
              }}
            /> */}
          </div>
        </div>
        <p className="m-0 fw-500 font-xssss text-gray-follow">abc@gmail.com</p>
      </div>
      <div className="mb-2">
        <p className="m-0 fw-700 font-xssss">Service</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">Stock Broker</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">
          Real estate Broker
        </p>
      </div>
      <div className="mb-2">
        <p className="m-0 fw-700 font-xssss">Location</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">
          Ho Chi Minh City, Vietnam
        </p>
      </div>
      <div className="">
        <p className="m-0 fw-700 font-xssss">Interested Topic</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">VNIndex</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">NASDAQ</p>
        <p className="m-0 fw-500 font-xssss text-gray-follow">
          Fundamental Analysis
        </p>
      </div>
    </div>
  );
};

export default AiSummary;
