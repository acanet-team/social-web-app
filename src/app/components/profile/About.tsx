import React, { useCallback, useEffect, useState } from "react";
import { TruncateText } from "../TruncateText";
import styles from "@/styles/modules/profile.module.scss";
import Image from "next/image";
import { ModalAbout } from "./ModalAbout";

export const About = ({ role }: { role: boolean }) => {
  const [show, setShow] = useState(false);
  const [aboutText, setAboutText] = useState("");

  useEffect(() => {
    setAboutText(
      "Educational pursuits at Oxford and MIT, coupled with formative years at McKinsey and in investment banking, following the successful establishment and sale of Misfit, a US-based tech company, and leadership roles at Facebook and GoJek as Country CEO for Vietnam, have got myself drawn to endeavors that prioritize people development and collaborative ideation.",
    );
  }, []);

  const handleOpen = useCallback(() => {
    setShow((show) => !show);
  }, [show]);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const handleSubmit = useCallback(() => {
    // setShow(false);
  }, []);

  return (
    <>
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
          {role === true && (
            <h4>
              <i
                className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                onClick={() => handleOpen()}
              ></i>
            </h4>
          )}
        </div>
        <div>
          {show ? (
            <TruncateText
              content={aboutText}
              wordLimit={150}
              className="m-0 font-xsss fw-400 lh-20"
            />
          ) : (
            <div>
              <div
                style={{
                  resize: "none",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  paddingRight: "0px",
                }}
              >
                <textarea
                  className="w-100 m-0 font-xsss fw-400 lh-20 theme-dark-bg d-flex"
                  onChange={(event) => {
                    console.log("mmm", event.target.value);
                    setAboutText(event.target.value);
                  }}
                  rows={5}
                  value={aboutText}
                  maxLength={1000}
                  style={{
                    resize: "none",
                    border: "none",
                  }}
                  placeholder="Please write your description"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <button
                  className="px-4 py-1 bg-blue-button text-white font-xsss"
                  style={{ marginRight: "0px", border: "none" }}
                >
                  <p className="m-0">Save</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* {show && (
        <ModalAbout
          handleClose={handleCancel}
          handleShow={handleOpen}
          title={"Edit About"}
          show={show}
          data={text}
          setText={setText}
        />
      )} */}
    </>
  );
};
