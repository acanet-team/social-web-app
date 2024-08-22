import React from "react";
import { TruncateText } from "../TruncateText";
import styles from "@/styles/modules/profile.module.scss";
import Image from "next/image";

export const About = () => {
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
        className="mb-4"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h2 className="m-0 fw-600">About</h2>
        <h4>
          <i className={`bi bi-pencil-fill ${styles["icon-profile"]}`}></i>
        </h4>
        {/* <Image
          src="/assets/images/profile/icons8-edit-100 6.png"
          width={20}
          height={20}
          alt=""
          className=""
          style={{
            objectFit: "cover",
          }}
        /> */}
      </div>
      <div>
        <TruncateText
          content={`Educational pursuits at Oxford and MIT, coupled with
                    formative years at McKinsey and in investment banking,
                    following the successful establishment and sale of Misfit, a
                    US-based tech company, and leadership roles at Facebook and
                    GoJek as Country CEO for Vietnam, have got myself drawn to
                    endeavors that prioritize people development and
                    collaborative ideation.`}
          wordLimit={150}
          className=" m-0 font-xsss fw-400 lh-20"
        />
      </div>
    </div>
  );
};
