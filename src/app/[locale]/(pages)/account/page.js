'use client';

import React, { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  FormHelperText,
} from '@mui/material';

import Header from '../../../components/Header';
import Leftnav from '../../../components/Leftnav';
import Appfooter from '../../../components/Appfooter';
import Popupchat from '../../../components/Popupchat';
import useAxios from '../../../../hooks/useAxios';

export default function Account() {
  const [regionList, setRegionList] = useState();
  setRegionList(['Vietnam', 'Thailand', 'Singapore', 'Indonesia']);
  const { /* isLoading, error, */ sendRequest } = useAxios();

  // Get user data
  useEffect(() => {
    const fetchConfig = {
      url: 'http://localhost:3000/api/v1/auth/me',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    function datahandleFn(data) {
      console.log(data);
    }
    sendRequest(fetchConfig, datahandleFn);
  }, []);

  // Form validation
  const validate = (values) => {
    const errors = {};

    if (!values.nickname) {
      errors.nickname = 'Please fill out a valid nickname.';
    } else if (values.nickname.length > 20 || values.nickname.length < 8) {
      errors.nickname = 'Nick name must be between 8 and 20 characters.';
    }

    if (!values.region) {
      errors.region = 'Please choose a region.';
    }

    if (!values.email) {
      errors.email = 'Please fill out a valid email.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      nickname: '',
      region: '',
      userType: 'investor',
      email: '',
    },
    validate,
    onSubmit: (values) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
      }, 400);
    },
  });

  return (
    <Fragment>
      <Header />
      <Leftnav />

      <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                  <Link href="/defaultsettings" className="d-inline-block mt-2">
                    <i className="ti-arrow-left font-sm text-white"></i>
                  </Link>
                  <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">
                    Account Details
                  </h4>
                </div>
                <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                  <div className="row justify-content-center">
                    <div className="col-lg-4 text-center">
                      <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                        <img
                          src="https://via.placeholder.com/300x300.png"
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
                    <label
                      className="mont-font fw-600 font-xsss mb-2"
                      htmlFor="nickname"
                    >
                      Nickname
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nickname"
                      id="nickname"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.nickname}
                    />
                    {formik.touched.nickname && formik.errors.nickname ? (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {formik.errors.nickname}
                      </FormHelperText>
                    ) : null}

                    <label className="mont-font fw-600 font-xsss mt-3">
                      Region
                    </label>
                    <FormControl
                      fullWidth
                      id="region"
                      error={
                        formik.touched.region && Boolean(formik.errors.region)
                      }
                    >
                      <Select
                        className="form-control"
                        labelId="region"
                        id="region"
                        name="region"
                        value={formik.values.region}
                        onChange={(e) =>
                          formik.setFieldValue('region', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.region && Boolean(formik.errors.region)
                        }
                        sx={{
                          '& fieldset': {
                            border: 'none',
                          },
                          padding: '0',
                          fontSize: '14px',
                          color: 'inherit',
                          fontFamily: 'inherit',
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Choose a region</em>
                        </MenuItem>
                        {regionList.map((region) => {
                          return (
                            <MenuItem value={region} key={region}>
                              {region}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.touched.region && (
                        <FormHelperText
                          sx={{ color: 'error.main', marginLeft: '0' }}
                        >
                          {formik.errors.region}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <label className="mont-font fw-600 font-xsss mt-3">
                      User type
                    </label>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik.values.userType === 'investor'}
                            onChange={() =>
                              formik.setFieldValue('userType', 'investor')
                            }
                            sx={{ fontSize: '14px' }}
                          />
                        }
                        label="Investor"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '14px',
                            fontFamily: 'Montserrat',
                          },
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formik.values.userType === 'broker'}
                            onChange={() =>
                              formik.setFieldValue('userType', 'broker')
                            }
                          />
                        }
                        label="Broker"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '14px',
                            fontFamily: 'Montserrat',
                          },
                        }}
                      />
                    </FormGroup>

                    <label
                      className="mont-font fw-600 font-xsss mt-3"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      sx={{ color: 'inherit' }}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {formik.errors.email}
                      </FormHelperText>
                    ) : null}

                    <button
                      type="button"
                      className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 border-0 d-inline-block mt-5"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popupchat />
      <Appfooter />
    </Fragment>
  );
}
