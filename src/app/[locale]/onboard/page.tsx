"use client";
import React, { useEffect, useState, MouseEvent } from "react";
import styles from "@/styles/modules/onboard.module.scss";
import classNames from "classnames";
import Account from "@/app/components/onboard/CreatProfileForm";
import CreateProfile from "@/app/components/onboard/CreateProfile";
import Interests from "@/app/components/onboard/Interests";
import Brokers from "@/app/components/onboard/Brokers";
const onboardPage = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  const [curstep, setCurstep] = useState<number>(1);
  const numSteps = 3;

  const onClickNextStep = () => {
    setCurstep((step) => step + 1);
    if (curstep > numSteps) {
      setCurstep(1);
    }
  };
  useEffect(() => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const stepDivs = document.querySelectorAll(`.${styles.step}`);
    const handleCLick = function (e: any) {
      const clickedTab = (e.target as HTMLElement).closest(
        `.${styles["step"]}`,
      ) as HTMLElement;
      // Find tab number and update curPage
      const clickedTabNum = Number(clickedTab?.dataset.tab);
      if (clickedTab && curstep + 2 > clickedTabNum) {
        setCurstep(clickedTabNum);
      }
    };

    stepDivs.forEach((stepDiv, index) => {
      // Hightlight chosen tab
      let stepNum = index + 1;
      if (stepNum === curstep) {
        stepDiv.classList.add(`${styles["editing"]}`);
      } else {
        stepDiv.classList.remove(`${styles["editing"]}`);
      }
      if (stepNum < curstep) {
        stepDiv.classList.remove(`${styles["editing"]}`);
        stepDiv.classList.add(`${styles["done"]}`);
      } else {
        stepDiv.classList.remove(`${styles["done"]}`);
      }

      stepDiv.addEventListener("click", handleCLick as EventListener);

      // Reveal corresponding content
      const contentContainer = document.querySelectorAll(
        `.${styles["tab-content__container"]}`,
      );
      contentContainer.forEach((content) =>
        content.classList.remove(`${styles["content-active"]}`),
      );
      document
        .querySelector(`.tab-content__container--${curstep}`)
        ?.classList.add(`${styles["content-active"]}`);
    });

    return () => {
      stepDivs.forEach((stepDiv) =>
        stepDiv.removeEventListener("click", handleCLick as EventListener),
      );
    };
  }, [curstep]);

  return (
    <>
      <div className={styles["stepper-horizontal"]} id={styles["stepper1"]}>
        <div
          className={classNames(styles["step"], styles["editing"], "step-1")}
          data-tab="1"
        >
          <div className={styles["step-circle"]}>
            <span>1</span>
          </div>
          <div className={styles["step-title"]}>Create your profile</div>
          <div className={styles["step-bar-left"]}></div>
          <div className={styles["step-bar-right"]}></div>
        </div>
        <div className={classNames(styles["step"], "step-2")} data-tab="2">
          <div className={styles["step-circle"]}>
            <span>2</span>
          </div>
          <div className={styles["step-title"]}>Select topics</div>
          <div className={styles["step-bar-left"]}></div>
          <div className={styles["step-bar-right"]}></div>
        </div>
        <div className={classNames(styles["step"], "step-3")} data-tab="3">
          <div className={styles["step-circle"]}>
            <span>3</span>
          </div>
          <div className={styles["step-title"]}>Follow brokers</div>
          <div className={styles["step-optional"]}>Optional</div>
          <div className={styles["step-bar-left"]}></div>
          <div className={styles["step-bar-right"]}></div>
        </div>
      </div>

      <div className="tab-content">
        <div
          className={classNames(
            styles["active-tab"],
            styles["tab-content__container"],
            "tab-content__container--1",
          )}
        >
          <CreateProfile onNextHandler={onClickNextStep} />
        </div>
        <div
          className={classNames(
            "tab-content__container--2",
            styles["tab-content__container"],
          )}
        >
          <Interests onNextHandler={onClickNextStep} />
        </div>
        <div
          className={classNames(
            "tab-content__container--3",
            styles["tab-content__container"],
          )}
        >
          <Brokers onNextHandler={onClickNextStep} />
        </div>
      </div>

      {/* <button
        className={`btn main-btn ${styles["onboard-btn"]}`}
        onClick={onClickNextStep}
      >
        Next
      </button> */}
    </>
  );
};

export default onboardPage;
