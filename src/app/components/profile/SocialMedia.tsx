import React, { useCallback, useState } from "react";
import styles from "@/styles/modules/profile.module.scss";
import Image from "next/image";
import { ModalSocialMedia } from "./ModalSocialMedia";

const SocialMedia = ({ role }: { role: boolean }) => {
  const [show, setShow] = useState(false);

  const handleOpenModal = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
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
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="m-0 mb-1 fw-700 font-xssss">Social Medias</p>
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
                  <i
                    className={`bi bi-plus-lg ${styles["icon-profile"]}`}
                    onClick={() => handleOpenModal()}
                  ></i>
                </h1>
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]}`}
                    onClick={() => handleOpenModal()}
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <Image
            src="/assets/images/profile/zalo.png"
            width={16}
            height={16}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
          <Image
            src="/assets/images/profile/zalo.png"
            width={16}
            height={16}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
          <Image
            src="/assets/images/profile/zalo.png"
            width={16}
            height={16}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
          <Image
            src="/assets/images/profile/zalo.png"
            width={16}
            height={16}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
          <Image
            src="/assets/images/profile/zalo.png"
            width={16}
            height={16}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
          <Image
            src="/assets/images/profile/zalo.png"
            width={16}
            height={16}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {show && (
        <ModalSocialMedia
          handleClose={handleCancel}
          handleShow={handleOpenModal}
          title="Education"
          show={show}
        />
      )}
    </>
  );
};

export default SocialMedia;
