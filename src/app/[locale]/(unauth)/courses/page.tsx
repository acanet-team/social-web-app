'use client';
import React, { Fragment, useState } from 'react';
import styles from '@/styles/modules/courses.module.scss';

export default function Courses() {
  const [coursesList, setCoursesList] = useState([
    {
      id: 1,
      nameCourse:
        'AI Revolution: Harnessing the Power of Artificial Intelligence',
      author: 'Kristin Watson',
      imgCourse: 'assets/images/imgCourse.png',
      imgAuthor: 'assets/images/imgAuthor.png',
      price: '$24',
    },
    {
      id: 2,
      nameCourse:
        'AI Revolution: Harnessing the Power of Artificial Intelligence',
      author: 'Kristin Watson',
      imgCourse: 'assets/images/imgCourse.png',
      imgAuthor: 'assets/images/imgAuthor.png',
      price: '$24',
    },
    {
      id: 3,
      nameCourse:
        'AI Revolution: Harnessing the Power of Artificial Intelligence',
      author: 'Kristin Watson',
      imgCourse: 'assets/images/imgCourse.png',
      imgAuthor: 'assets/images/imgAuthor.png',
      price: '$24',
    },
    {
      id: 4,
      nameCourse:
        'AI Revolution: Harnessing the Power of Artificial Intelligence',
      author: 'Kristin Watson',
      imgCourse: 'assets/images/imgCourse.png',
      imgAuthor: 'assets/images/imgAuthor.png',
      price: '$24',
    },
  ]);
  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <h1 className="font-xxl">Courses</h1>
            <p className="font-xsss mb--2">
              Every request ID is meticulously recorded in this log. For more
              details, please review them carefully.
            </p>
            <div className="row">
              <div className="col-12">
                <div className="row ps-2 pe-2">
                  {coursesList &&
                    coursesList.length > 0 &&
                    coursesList.map((course, index) => (
                      <div key={index} className="col-md-4 col-sm-6 col-xs-12">
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-4">
                          <div className="position-relative ">
                            <img
                              src={course.imgCourse}
                              alt="courses"
                              className="w__100 h160 object-cover"
                            />
                            <div className={styles['enrolled']}>
                              <img
                                src={`assets/images/star-01.png`}
                                alt="star"
                                className="shadow-sm w16 "
                              />
                              <div className="text-black fw-700">
                                453 enrolled
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="font-xss">{course.nameCourse}</p>
                            <div className={styles['group-price']}>
                              <p className="font-xssss">Price</p>
                              <p className="fw-700 font-xs">{course.price}</p>
                            </div>
                            <div className={styles['group']}>
                              <img
                                src={course.imgAuthor}
                                alt="courses"
                                className="bg-white rounded-circle shadow-xss w35"
                              />
                              <div>
                                <p className="font-xsss m-0">{course.author}</p>
                                <div className={styles['group']}>
                                  <div className={styles['group-child']}>
                                    <p className="font-xssss m-0 fw-700">
                                      88.7k
                                    </p>
                                    <p className="font-xssss m-0 fw-200">
                                      followers
                                    </p>
                                  </div>
                                  <div className={styles['group-child']}>
                                    <p className="font-xssss m-0 fw-700">
                                      4.8/5
                                    </p>
                                    <p className="font-xssss m-0 fw-200">
                                      ratings
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="bg-current text-center rounded-3 w__100 border-0 d-inline-block mt-4"
                            >
                              <a href="/" className="text-white">
                                See more
                              </a>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
