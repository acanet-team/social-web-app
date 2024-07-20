'use client';

import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material';
import { ToastContainer, toast, type ToastOptions } from 'react-toastify';
import styles from '@/styles/modules/account.module.scss';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import type { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import useAuthStore from '@/store/auth';
import Image from 'next/image';
import { createProfileRequest } from '@/api/user';
import { useRouter } from 'next/navigation';

interface FormValues {
  nickName: string;
  location: string;
  isBroker: string;
  email: string;
}
interface FormErrors {
  nickName?: string;
  location?: string;
  isBroker?: string;
  email?: string;
}

export default function Account() {
  const router = useRouter();
  const { createProfile } = useAuthStore((state: any) => state.createProfile);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);
  const [locationList, setRegionList] = useState([
    'Vietnam',
    'Thailand',
    'Singapore',
    'Indonesia',
  ]);
  const { email, nickName, photo } = useAuthStore((state: any) => state.user);

  // Toast notification
  const throwToast = (message: string, notiType: string) => {
    const notiConfig: ToastOptions = {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const notify = () => {
      if (message !== '' && notiType === 'success') {
        toast.success(message, notiConfig);
      } else if (message !== '' && notiType === 'error') {
        toast.error(message, notiConfig);
      }
    };

    notify();
  };

  // Form validation
  const validate = (values: FormValues) => {
    const errors: FormErrors = {};
    if (!values.location) {
      errors.location = 'Please choose a location.';
    }
    if (values.isBroker === null) {
      errors.isBroker = 'Please choose the user type.';
    }

    if (!nickName) {
      if (!values.nickName) {
        errors.nickName = 'Please fill out a valid nickname.';
      } else if (values.nickName.length > 20 || values.nickName.length < 8) {
        errors.nickName = 'Nick name must be between 8 and 20 characters.';
      }
    }
    if (!email) {
      if (!values.email) {
        errors.email = 'Please fill out a valid email.';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      nickName: '',
      location: '',
      isBroker: '0',
      email: '',
    },
    validate,
    onSubmit: async (values, { setFieldError }) => {
      if (nickName) values.nickName = nickName;
      if (email) values.email = email;
      values.nickName = values.nickName?.toLowerCase().trim();
      values.location = values.location?.toLowerCase().trim();
      values.email = values.email?.toLowerCase().trim();
      // @ts-ignore
      values.isBroker = values.isBroker === '1' ? true : false;

      try {
        // call api
        await createProfileRequest(values);
        const successMessage = 'Your profile has been updated.';
        throwToast(successMessage, 'success');
        // Save data in auth store
        createProfile(null, values);
      } catch (err) {
        console.log(err);
        const errors = err as AxiosError;
        let errorMessage = '';
        const errorCode = (errors?.response?.data as any)?.errorCode;
        if (errorCode === 'ER1018') {
          errorMessage = 'Nickname already exists.';
          setFieldError('nickName', errorMessage);
          throwToast(errorMessage, 'error');
        } else if (errorCode === 'ER3013') {
          errorMessage = "You're not a whitelisted broker.";
          setFieldError('isBroker', errorMessage);
          throwToast(errorMessage, 'error');
        } else if (errorCode === 'ER1010') {
          errorMessage = 'User profile already existed.';
          setFieldError('nickName', errorMessage);
          throwToast(errorMessage, 'error');
        }
      } finally {
        // stop loading
        // Router.push("/interest");
        router.push('/interest');
      }
    },
  });

  return (
    <>
      <div className="create-profile main-content bg-lightblue theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                  <Link href="/defaultsettings" className="d-inline-block mt-2">
                    <i className="ti-arrow-left font-sm text-white" />
                  </Link>
                  <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                    Account Details
                  </h4>
                </div>
                <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                  <div className="row justify-content-center">
                    <div className="col-lg-4 text-center">
                      <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                        <Image
                          src={
                            photo || 'https://via.placeholder.com/300x300.png'
                          }
                          width={100}
                          height={100}
                          alt="avatar"
                          className="shadow-sm rounded-3 w-100"
                        />
                      </figure>
                      <h2 className="fw-700 font-sm text-grey-900 mt-3">
                        Surfiya Zakir
                      </h2>
                      <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">
                        Brooklyn
                      </h4>
                    </div>
                  </div>

                  <form onSubmit={formik.handleSubmit}>
                    {/* eslint-disable-next-line */}
                    <label className="fw-600 mb-2" htmlFor="nickName">
                      Nickname
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nickName"
                      id="nickName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={nickName ? nickName : formik.values.nickName}
                      disabled={nickName ? true : false}
                    />
                    {formik.touched.nickName && formik.errors.nickName ? (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {formik.errors.nickName}
                      </FormHelperText>
                    ) : null}

                    {/* eslint-disable-next-line */}
                    <label className="fw-600 mt-3">Region</label>
                    <FormControl
                      fullWidth
                      id="location"
                      error={
                        formik.touched.location &&
                        Boolean(formik.errors.location)
                      }
                    >
                      <Select
                        className="form-control d-flex align-items-center"
                        labelId="location"
                        id="location"
                        name="location"
                        value={formik.values.location}
                        onChange={(e) =>
                          formik.setFieldValue('location', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.location &&
                          Boolean(formik.errors.location)
                        }
                        sx={{
                          '& fieldset': {
                            border: 'none',
                          },
                          '& .MuiInputBase-input': {
                            padding: '0 !important',
                            fontSize: '16px',
                            color: '#fff !important',
                          },
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Choose a location</em>
                        </MenuItem>
                        {locationList.map((location) => {
                          return (
                            <MenuItem
                              value={location?.toLowerCase()}
                              key={location}
                            >
                              {location}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.touched.location && (
                        <FormHelperText
                          sx={{ color: 'error.main', marginLeft: '0' }}
                        >
                          {formik.errors.location}
                        </FormHelperText>
                      )}
                    </FormControl>

                    {/* eslint-disable-next-line */}
                    <label className="fw-600 mt-3" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={email ? email : formik.values.email}
                      disabled={email ? true : false}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {formik.errors.email}
                      </FormHelperText>
                    ) : null}

                    {/* eslint-disable-next-line */}
                    <label className="fw-600 mt-3 mb-1">User type</label>
                    <div
                      id={styles['profile-radio']}
                      className="profile-radio-btn"
                    >
                      <input
                        type="radio"
                        name="isBroker"
                        id="investor"
                        value="0"
                        defaultChecked
                        onChange={(e) =>
                          formik.setFieldValue('isBroker', e.target.value)
                        }
                      />
                      <label htmlFor="investor">Investor</label>
                      <input
                        type="radio"
                        name="isBroker"
                        id="broker"
                        value="1"
                        onChange={(e) =>
                          formik.setFieldValue('isBroker', e.target.value)
                        }
                      />
                      <label htmlFor="broker">Broker</label>
                    </div>
                    {formik.errors.isBroker ? (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {formik.errors.isBroker}
                      </FormHelperText>
                    ) : null}

                    <button
                      type="submit"
                      id={styles['profile-btn']}
                      className="bg-current text-center text-white fw-600 p-3 w175 rounded-3 border-0 d-inline-block mt-5"
                    >
                      Save
                    </button>
                  </form>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
