import React from "react";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/userInvite.module.scss";

export default function UserInvite() {
  const t = useTranslations("Community");

  return (
    <div className={styles["user-invite__container"]}>
      <h4 className="fw-700 fs-3 text-current mb-4">{t("invite_user")}</h4>
      <div className="card bg-transparent-card border-0 d-block mt-3">
        <h4 className="d-inline font-xsss text-grey-500 fw-700">Setting 1</h4>
        <div className="d-inline float-right mt-1">
          <label className="toggle toggle-menu-color">
            <input type="checkbox" />
            <span className="toggle-icon"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
