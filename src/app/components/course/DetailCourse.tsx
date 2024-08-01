"use client";
import { coursesList } from "@/app/fakeData/data-investor-course";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/courses.module.scss";
import DropDown from "../DropDown";
import Rating from "../Ratings";
import RichTextView from "../RichTextView";
import type { Course } from "@/api/course";

interface Props {
  id: number;
}

export default function DetailCourse({ id }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const numericId = Number(id);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "theme-dark",
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
        // document.body.classList.replace(theme, storedTheme);
      }
    };
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener,
      );
    };
  }, [theme]);

  useEffect(() => {
    const findCourse = coursesList.find((data) => data.id === numericId);
    setCourse(findCourse || null);
  }, [numericId]);

  const totalLectures =
    course?.couseContent?.reduce(
      (acc, item) => acc + item.childList.length,
      0,
    ) || 0;

  const totalCourseDuration =
    course?.couseContent?.reduce(
      (acc, item) => acc + item.course_duration,
      0,
    ) || 0;

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-8">
          <div>
            <h1 className="fw700 font-xxl">{course?.nameCourse}</h1>
            <p className="m-0 font-sm fw400 mb-2">{course?.description}</p>
          </div>
          <div className="mb-4">
            <div className={styles["group"]}>
              <div className="bg-red-gradiant px-2 py-1 text-white font-xssss">
                Best seller
              </div>
              <p className="m-0 font-xsss">4.7</p>
              <Rating rating={4.7} />
              <div className="m-0 font-xsss text-blue">
                ({course?.ratings} ratings)
              </div>
            </div>
            <div className={styles["group"]}>
              <p className="m-0 font-xsss ">Created by</p>
              <Image
                src={course?.imgAuthor ?? ""}
                alt={course?.author ?? ""}
                width={24}
                height={24}
              />
              <div>
                <div className={styles["group"]}>
                  <div className={styles["group-child"]}>
                    <p className="font-xsss m-0">{course?.author}</p>
                  </div>
                  <div className={styles["group-child"]}>
                    <p className="font-xssss m-0 fw-700">{course?.followers}</p>
                    <p className="font-xssss m-0 fw-200">followers</p>
                  </div>
                  <div className={styles["group-child"]}>
                    <p className="font-xssss m-0 fw-700">4.8/5</p>
                    <p className="font-xssss m-0 fw-200">ratings</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["group"]}>
              <p className="font-xssss m-0">Last update</p>
              <p className="font-xssss m-0">{course?.dateUpdate}</p>
            </div>
          </div>
          <div className="mb-5">
            <h1 className="mb-3">What you&apos;ll learn</h1>
            <div className={`${styles["bgCard"]} card px-4 py-3 `}>
              <div className="row">
                {course?.reasonList?.map((reasonList, index) => (
                  <div key={index} className="col-6">
                    <div className={styles["group"]}>
                      <Image
                        src={
                          theme === "theme-dark"
                            ? `/assets/icon/icon-check-white.svg`
                            : `/assets/icon/icon-check-black.svg`
                        }
                        width={24}
                        height={24}
                        alt="icon-check"
                      />
                      <p className="text-xss m-0">{reasonList.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-5">
            <h1>Course content</h1>
            <DropDown
              data={course?.couseContent}
              totalLectures={totalLectures}
              totalCourseDuration={totalCourseDuration}
              theme={theme}
            />
          </div>
          <div className="mb-5">
            <h1 className="mb-3">Description</h1>
            <div className={`${styles["bgCard"]} card px-4 py-3 `}>
              <RichTextView text={course?.content || ""} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className={`${styles["bgCard"]} card`}>
            <Image
              src={course?.imgCourse ?? ""}
              alt={course?.nameCourse ?? ""}
              width={300}
              height={190}
              className={`${styles["imgCard"]} w__100 object-cover`}
            />
            <div className="p-3">
              <div className={`${styles["group-price-ba"]}`}>
                <p className="font-xxl fw-700 m-0">
                  ${" "}
                  {course?.discount
                    ? `${course.discount * course?.price}`
                    : `${course?.price}`}
                </p>
                <p
                  className="font-xs fw-400 m-0"
                  style={{ textDecoration: "line-through" }}
                >
                  ${course?.price}
                </p>
              </div>
              <p className="font-xss fw-400 m-0">
                {course?.discount ? `${course.discount * 100}% off` : ""}
              </p>
              <div className={styles["group"]}>
                <Image
                  src="/assets/images/icon-alarm.png"
                  width={18}
                  height={18}
                  alt="icon-alarm"
                />
                <div className={`${styles["time-discount"]} font-xss fw-400`}>
                  2 days left at this price!
                </div>
              </div>
              <button className="bg-current text-center rounded-3 py-1 w__100 border-0 d-inline-block mt-4">
                <p className="m-0">Buy now</p>
              </button>
              <p
                className="font-xsssss fw-400 m-0 mb-3"
                style={{ textAlign: "center" }}
              >
                30-Day Money-Back Guarantee
              </p>
              <div>
                <p className="font-xss fw-600 m-0">This course includes:</p>
                <div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={
                        theme === "theme-dark"
                          ? `/assets/icon/icon-video-white.svg`
                          : `/assets/icon/icon-video-black.svg`
                      }
                    />
                    <p className="font-xsss fw-600 m-0">
                      {(totalCourseDuration / 60).toFixed(1)} hours on-demand
                      video
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={
                        theme === "theme-dark"
                          ? `/assets/icon/icon-square-white.svg`
                          : `/assets/icon/icon-square-black.svg`
                      }
                    />
                    <p className="font-xsss fw-600 m-0">
                      {totalLectures} articles
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={
                        theme === "theme-dark"
                          ? `/assets/icon/icon-down-white.svg`
                          : `/assets/icon/icon-down-black.svg`
                      }
                    />
                    <p className="font-xsss fw-600 m-0">
                      3 downloadable resources
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={
                        theme === "theme-dark"
                          ? `/assets/icon/icon-iphone-white.svg`
                          : `/assets/icon/icon-iphone-black.svg`
                      }
                    />
                    <p className="font-xsss fw-600 m-0">
                      Access on mobile and TV
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={
                        theme === "theme-dark"
                          ? `/assets/icon/icon-certificate-white.svg`
                          : `/assets/icon/icon-certificate-black.svg`
                      }
                    />
                    <p className="font-xsss fw-600 m-0">
                      Certificate of completion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
