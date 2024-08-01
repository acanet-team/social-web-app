"use client";
import React from "react";
import styles from "@/styles/modules/courses.module.scss";
import Image from "next/image";
import { coursesList } from "@/app/fakeData/data-investor-course";
import { useRouter } from "next/navigation";

export default function ListCourses() {
  const router = useRouter();

  const formatNumber = (number: number) => {
    if (number < 1000) return number;
    return `${(number / 1000).toFixed(1)}k`;
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="row ps-2 pe-2">
            {coursesList?.length > 0 &&
              coursesList.map((course, index) => (
                <div key={index} className="col-md-4 col-sm-6 col-12">
                  <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-4">
                    <div className="position-relative ">
                      <Image
                        width={300}
                        height={160}
                        src={course.imgCourse}
                        alt="courses"
                        className="w__100 h160 object-cover"
                      />
                      <div className={styles["enrolled"]}>
                        <Image
                          width={16}
                          height={16}
                          src={`/assets/images/star-01.png`}
                          alt="star"
                          className="shadow-sm w16 "
                        />
                        <div className="text-black fw-700">453 enrolled</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className={styles["truncate"]}>{course.nameCourse}</p>
                      <div className={styles["group-price"]}>
                        <p className="font-xssss">Price</p>
                        <p className="fw-700 font-xs">${course.price}</p>
                      </div>
                      <div className={styles["group"]}>
                        <Image
                          width={35}
                          height={35}
                          src={course.imgAuthor}
                          alt="courses"
                          className="bg-white rounded-circle shadow-xss w35"
                        />
                        <div>
                          <p className="font-xsss m-0">{course.author}</p>
                          <div className={styles["group"]}>
                            <div className={styles["group-child"]}>
                              <p className="font-xssss m-0 fw-700 ">
                                {formatNumber(88700)}
                              </p>
                              <p className="font-xssss m-0 fw-200">followers</p>
                            </div>
                            <div className={styles["group-child"]}>
                              <p className="font-xssss m-0 fw-700">4.8/5</p>
                              <p className="font-xssss m-0 fw-200">ratings</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="bg-current text-center rounded-3 w__100 border-0 d-inline-block mt-4"
                        onClick={() =>
                          router.push(`/courses/investor/detail/${course.id}`)
                        }
                      >
                        <p className="m-0 ">See more</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
