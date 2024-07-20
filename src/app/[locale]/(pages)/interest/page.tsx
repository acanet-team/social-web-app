'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/modules/interest.module.scss';
import { createGetAllTopicsRequest } from '@/api/user';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';

export default function Interest() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // const [options, setOptions] = useState<string[]>([]);
  const [pagination, setPagination] = useState<number>(1);
  const [curPage, setCurPage] = useState<number>(1);
  const TOPICS_PER_PAGE = 20;

  useEffect(() => {
    // async function fetchTopics() {
    //   try {
    //     const response: any = await createGetAllTopicsRequest(
    //       curPage,
    //       TOPICS_PER_PAGE,
    //     );
    //     const topics: string[] = response.docs.map((obj: any) => obj.topicName);
    //     setOptions(topics);
    //     setPagination(Math.ceil(response.total / response.take));
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // fetchTopics();
  }, [TOPICS_PER_PAGE, curPage]);

  const manipulateClasses = (e: any, addedClass: any, removedClass: any) => {
    e.target.classList.remove(removedClass);
    e.target.classList.add(addedClass);
  };

  const toggleSelection = (e: any, option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions((prevState) => prevState.filter((o) => o !== option));
      manipulateClasses(e, styles['btn-unselected'], styles['btn-selected']);
    } else {
      setSelectedOptions((prevState) => [...prevState, option]);
      manipulateClasses(e, styles['btn-selected'], styles['btn-unselected']);
    }
  };

  const onChangePageHandler = (page: number) => {
    console.log(page);
    setCurPage(page);
  };

  const onSelectInterestHandler = () => {
    console.log(selectedOptions);
    // Send data to server
    if (selectedOptions.length === 0) {
      return setError('Please choose at least 1 interest topic.');
    }
    router.push('/broker-list');
  };

  // Example options
  const options = [
    'Technology',
    'Stock',
    'Blockchain',
    'Web 3',
    'Cryptocurrency',
    'Real estate',
    'Technical analysis',
    'NFT',
    'Bitcoin',
    'ETH',
    'Solana',
  ];
  return (
    <>
      <div
        id={styles.interest}
        className="main-content bg-lightblue theme-dark-bg right-chat-active"
      >
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-current border-0 rounded-3">
                  <Link href="/defaultsettings" className="d-inline-block mt-2">
                    <i className="ti-arrow-left font-sm text-white" />
                  </Link>
                  <h4 className="fs-1 text-white fw-800">
                    What are you interested in?
                  </h4>
                  <p>
                    Select some topics you are interested in to help personalize
                    your experience.
                  </p>
                </div>
                <div className="card-body p-lg-5 p-4 w-100 border-0 d-flex flex-wrap justify-content-center gap-3 mb-5">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={(e) => toggleSelection(e, option)}
                      className="btn"
                    >
                      {option}
                    </button>
                  ))}

                  {/* Pagination */}
                  {/* <nav>
                    <ul className="pagination pagination-sm">
                      {Array.from({ length: 5 }, (_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${curPage === index + 1 ? styles.active : ''}`}
                          onClick={(e) =>
                            onChangePage(
                              parseInt(e.currentTarget.textContent || '1', 10),
                            )
                          }
                        >
                          <span className="">{index + 1}</span>
                        </li>
                      ))}
                    </ul>
                  </nav> */}
                </div>
                {pagination !== 1 && (
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
                )}
                {error && <div className="text-white mx-auto">{error}</div>}
                <button
                  type="submit"
                  className="bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-5 mx-auto"
                  onClick={onSelectInterestHandler}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
