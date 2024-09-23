import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormHelperText, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import { donateBroker } from "@/api/wallet";
import { throwToast } from "@/utils/throw-toast";

export default function CreateSignal() {
  const tSignal = useTranslations("CreateSignal");
  // fetch from server
  const options = ["a", "b", "c"];
  const filter = createFilterOptions<string>();

  const validationSchema = Yup.object({
    pairs: Yup.string().required(tSignal("error_missing_currency_pairs")),
    type: Yup.string().required(tSignal("error_missing_type")),
    expiry: Yup.date()
      .required(tSignal("error_missing_expiry"))
      .test("is-future-date", tSignal("error_invalid_expiry"), (value) => {
        return value && new Date(value) > new Date();
      }),
    entry: Yup.number()
      .transform((value) => (isNaN(value) ? 0 : Number(value)))
      .required(tSignal("error_missing_entry"))
      .min(0.0000000001, tSignal("error_min_entry")),
    target: Yup.lazy((value, { parent }) =>
      parent.type === "long"
        ? Yup.number()
            .transform((value) => (isNaN(value) ? 0 : Number(value)))
            .required(tSignal("error_missing_target"))
            .min(0.0000000001, tSignal("error_min_target"))
            .test(
              "is-target-long",
              tSignal("error_invalid_low_target"),
              (value) => {
                return value > parent.entry;
              },
            )
        : Yup.number()
            .transform((value) => (isNaN(value) ? 0 : Number(value)))
            .required(tSignal("error_missing_target"))
            .min(0.0000000001, tSignal("error_min_target"))
            .test(
              "is-target-short",
              tSignal("error_invalid_high_target"),
              (value) => {
                return value < parent.entry;
              },
            ),
    ),
    stop: Yup.lazy((value, { parent }) =>
      parent.type === "long"
        ? Yup.number()
            .transform((value) => (isNaN(value) ? 0 : Number(value)))
            .required(tSignal("error_missing_stop"))
            .min(0.0000000001, tSignal("error_min_stop"))
            .test(
              "is-stop-long",
              tSignal("error_invalid_high_stop"),
              (value) => {
                return value < parent.entry;
              },
            )
        : Yup.number()
            .transform((value) => (isNaN(value) ? 0 : Number(value)))
            .required(tSignal("error_missing_stop"))
            .min(0.0000000001, tSignal("error_min_stop"))
            .test(
              "is-stop-short",
              tSignal("error_invalid_low_stop"),
              (value) => {
                return value > parent.entry;
              },
            ),
    ),
  });

  const formik = useFormik({
    initialValues: {
      pairs: "",
      type: "",
      expiry: null,
      entry: "",
      target: "",
      stop: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.expiry) {
          const expiryAt = new Date(values.expiry).getTime();
          await donateBroker({
            signalPair: values.pairs,
            type: values.type,
            expiryAt: expiryAt,
            entry: values.entry.toString(),
            target: values.target.toString(),
            stop: values.stop.toString(),
            description: values.description,
          });
          throwToast("Signal created!", "success");
          resetForm();
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleBlur = (field: string) => (event: React.FocusEvent<any>) => {
    formik.setFieldTouched(field, true);
    formik.handleBlur(event);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div
        style={{
          border: "2px solid #eee",
          padding: "10px 20px 45px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        {/* Signal pairs */}
        <div className="d-flex justify-content-between gap-2 mt-2 flex-xl-row flex-column">
          <FormControl
            sx={{ width: "100%", minWidth: "160px", marginTop: "1rem" }}
          >
            <Autocomplete
              id="pairs"
              options={options}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option,
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push(inputValue);
                }
                return filtered;
              }}
              value={formik.values.pairs}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>,
                newValue: string,
              ) => formik.setFieldValue("pairs", newValue || e.target.value)}
              // onBlur={handleBlur("pairs")}
              onBlur={formik.handleBlur}
              sx={{
                "& fieldset": {
                  minWidth: "160px",
                  border: "none",
                  borderBottom: "1px solid  #adb5bd",
                  borderRadius: "0",
                },
                "& .MuiOutlinedInput-root": {
                  padding: 0,
                },
                "& .MuiInputBase-input": {
                  fontSize: "16px",
                  color: "rgba(17, 17, 17, 0.7843137255)",
                  height: "56px",
                  boxSizing: "border-box",
                },
                "& .MuiSelect-icon": {
                  color: "#ddd",
                },
              }}
              renderInput={(params) => (
                <TextField label={tSignal("signal_pair")} {...params} />
              )}
            />

            {formik.touched.pairs && (
              <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
                {formik.errors.pairs}
              </FormHelperText>
            )}
          </FormControl>

          <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-0 mt-md-3">
            {/* Long short type */}
            <FormControl
              // variant="standard"
              // error={formik.touched.type && Boolean(formik.errors.type)}
              sx={{ minWidth: "130px", width: "100%" }}
            >
              <InputLabel id="type">{tSignal("type")}</InputLabel>
              <Select
                label={tSignal("type")}
                id="type"
                name={tSignal("type")}
                value={formik.values.type}
                onChange={(e) => {
                  formik.setFieldValue("type", e.target.value);
                }}
                onBlur={handleBlur("type")}
                // onBlur={formik.handleBlur}
                sx={{
                  "& fieldset": {
                    minWidth: "100px",
                    border: "none",
                    borderBottom: "1px solid #adb5bd",
                    borderRadius: "0",
                  },
                }}
              >
                <MenuItem value="long">Long</MenuItem>
                <MenuItem value="short">Short</MenuItem>
              </Select>
              {formik.touched.type && formik.errors.type ? (
                <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
                  {formik.errors.type}
                </FormHelperText>
              ) : null}
            </FormControl>

            {/* Date picker */}
            <FormControl
              // variant="standard"
              sx={{ minWidth: "170px", width: "100%" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={tSignal("expirary_date")}
                  value={formik.values.expiry}
                  onChange={(date) => {
                    formik.setFieldValue("expiry", dayjs(date));
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      onBlur: handleBlur("expiry"),
                    },
                  }}
                  sx={{
                    minWidth: "170px",
                    "& fieldset": {
                      border: "none",
                      borderBottom: "1px solid #adb5bd",
                      borderRadius: "0",
                    },
                  }}
                />
              </LocalizationProvider>
              {formik.touched.expiry && (
                <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
                  {formik.errors.expiry ? String(formik.errors.expiry) : ""}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>

        {/* Entry */}
        <div className="d-flex justify-content-between flex-sm-row flex-column mt-2 mt-md-3 gap-2">
          <FormControl
            variant="standard"
            sx={{ minWidth: "100px", width: "100%" }}
          >
            <TextField
              id="entry"
              label={tSignal("entry")}
              type="string"
              name="entry"
              value={formik.values.entry}
              // inputProps={{
              //   min: 0.0000000001,
              // }}
              // onBlur={(e) =>
              //   formik.setFieldValue(
              //     "entry",
              //     Number(Number(e.target.value).toFixed(10))
              //   )
              // }
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue("entry", e.target.value.replace(/,/g, "."))
              }
              InputProps={{
                style: {
                  borderRadius: "5px",
                },
                className: `${formik.touched.entry && formik.errors.entry ? "border-danger" : ""}`,
              }}
              sx={{
                minWidth: "100px",
                "& fieldset": {
                  minWidth: "100px",
                  border: "none",
                  borderBottom: "1px solid #adb5bd",
                  borderRadius: "0",
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
            />
            {formik.touched.entry && formik.errors.entry ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {JSON.stringify(formik.errors.entry).replace(/^"|"$/g, "")}
              </FormHelperText>
            ) : null}
          </FormControl>

          {/* Target */}
          <FormControl
            variant="standard"
            sx={{ minWidth: "100px", width: "100%" }}
          >
            <TextField
              label={tSignal("target")}
              type="string"
              name="target"
              value={formik.values.target}
              // inputProps={{
              //   min: 0.0000000001,
              // }}
              placeholder="Target"
              // onBlur={(e) =>
              //   formik.setFieldValue(
              //     "target",
              //     Number(Number(e.target.value).toFixed(10))
              //   )
              // }
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue(
                  "target",
                  e.target.value.replace(/,/g, "."),
                )
              }
              InputProps={{
                style: {
                  borderRadius: "5px",
                },
                className: `${formik.touched.target && formik.errors.target ? "border-danger" : ""}`,
              }}
              sx={{
                // fieldset: { border: "2px solid rgb(241, 241, 241)" },
                minWidth: "100px",
                "& fieldset": {
                  minWidth: "100px",
                  border: "none",
                  borderBottom: "1px solid #adb5bd",
                  borderRadius: "0",
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
            />
            {formik.touched.target && formik.errors.target ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {JSON.stringify(formik.errors.target).replace(/^"|"$/g, "")}
              </FormHelperText>
            ) : null}
          </FormControl>

          {/* Stop */}
          <FormControl
            variant="standard"
            sx={{ minWidth: "100px", width: "100%" }}
          >
            <TextField
              label={tSignal("stop")}
              type="string"
              name="stop"
              value={formik.values.stop}
              // inputProps={{
              //   min: 0.0000000001,
              // }}
              placeholder="Stop"
              // onBlur={(e) =>
              //   formik.setFieldValue(
              //     "stop",
              //     Number(Number(e.target.value).toFixed(10))
              //   )
              // }
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue("stop", e.target.value.replace(/,/g, "."))
              }
              InputProps={{
                style: {
                  borderRadius: "5px",
                },
                className: `${formik.touched.stop && formik.errors.stop ? "border-danger" : ""}`,
              }}
              sx={{
                minWidth: "100px",
                "& fieldset": {
                  minWidth: "100px",
                  border: "none",
                  borderBottom: "1px solid #adb5bd",
                  borderRadius: "0",
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
            />
            {formik.touched.stop && formik.errors.stop ? (
              <FormHelperText sx={{ color: "error.main" }}>
                {JSON.stringify(formik.errors.stop).replace(/^"|"$/g, "")}
              </FormHelperText>
            ) : null}
          </FormControl>
        </div>

        {/* Description */}
        <TextField
          id="description"
          name="description"
          label={tSignal("description")}
          multiline
          rows={1}
          inputProps={{
            maxLength: 100,
          }}
          value={formik.values.description}
          onChange={(e) => formik.setFieldValue("description", e.target.value)}
          sx={{
            width: "100%",
            marginTop: "1rem",
            "& fieldset": {
              minWidth: "100px",
              border: "none",
              borderBottom: "1px solid #adb5bd",
              borderRadius: "0",
            },
          }}
        />
      </div>
      <button
        id="submit"
        className="main-btn border-0 font-xsss ms-auto w175 fw-600 text-white card-body px-4 py-2 mt-4 d-flex align-items-center justify-content-center cursor-pointer"
      >
        <i className="rounded-3 font-xs me-1 text-white bi bi-graph-up"></i>
        {tSignal("create_signal")}
      </button>
    </form>
  );
}
