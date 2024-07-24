'use client';
import React, { Fragment, useState } from 'react';
import styles from '@/styles/modules/courses.module.scss';
import Pagetitle from '@/app/components/Pagetitle';
import { useTranslations } from 'next-intl';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Courses() {
  const t = useTranslations('CoursesList');
  const [pagination, setPagination] = useState<number>(1);
  const [curPage, setCurPage] = useState<number>(1);
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
        'Robotics and Automation: Revolutionizing Industries through Intelligent Machines',
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

  const onChangePageHandler = (page: number) => {
    setCurPage(page);
  };

  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <Pagetitle
              title={t('course_title')}
              intro={t('course_description')}
            />
            <div className="row">
              <div className="col-12">
                <div className="row ps-2 pe-2">
                  {coursesList &&
                    coursesList.length > 0 &&
                    coursesList.map((course, index) => (
                      <div key={index} className="col-md-4 col-sm-6 col-xs-12">
                        <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-4">
                          <div className="position-relative ">
                            <picture>
                              <img
                                src={course.imgCourse}
                                alt="courses"
                                className="w__100 h160 object-cover"
                              />
                            </picture>
                            <div className={styles['enrolled']}>
                              <picture>
                                <img
                                  src={`assets/images/star-01.png`}
                                  alt="star"
                                  className="shadow-sm w16 "
                                />
                              </picture>
                              <div className="text-black fw-700">
                                453 enrolled
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className={styles['truncate']}>
                              {course.nameCourse}
                            </p>
                            <div className={styles['group-price']}>
                              <p className="font-xssss">Price</p>
                              <p className="fw-700 font-xs">{course.price}</p>
                            </div>
                            <div className={styles['group']}>
                              <picture>
                                <img
                                  src={course.imgAuthor}
                                  alt="courses"
                                  className="bg-white rounded-circle shadow-xss w35"
                                />
                              </picture>
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

            <Stack spacing={2}>
              <Pagination
                count={pagination}
                variant="outlined"
                color="secondary"
                onClick={(e) =>
                  onChangePageHandler(
                    parseInt(e.currentTarget.textContent || '1', 10),
                  )
                }
                sx={{
                  '.MuiPagination-ul': { 'justify-content': 'center' },
                }}
              />
            </Stack>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
