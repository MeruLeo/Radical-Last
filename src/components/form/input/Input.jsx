import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import "./Input.css";

const Input = ({ title, type, generateValue, display, ...props }) => {
  const [field, meta] = useField(props);
  const [isFocus, setIsFocus] = useState(false);
  const { values } = useFormikContext();

  const inputId = `input-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const handleFocus = () => setIsFocus(true);
  const handleBlur = (e) => {
    setIsFocus(false);
    field.onBlur(e);
  };

  const isLabelShrunk = isFocus || field.value;

  // Determine the value to display
  const displayValue =
    generateValue !== undefined ? generateValue : field.value;

  return (
    <div className={`mt-4 relative ${display} font-iranSansReg`}>
      <input
        {...field}
        {...props}
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full p-2 text-background-white rounded-lg border-2 bg-transparent transition-all duration-200 outline-none ${
          isFocus ? "border-background-elm" : "border-background-elm2"
        }`}
        id={inputId}
        value={displayValue}
      />
      <label
        htmlFor={inputId}
        className={`absolute font-iranSans right-2 transition-all duration-200 pointer-events-none ${
          meta.touched && meta.error
            ? "-top-3 text-sm text-background-elm bg-background-org"
            : isLabelShrunk
              ? "-top-3 text-sm text-background-elm bg-background-org"
              : "top-3 text-background-elm2"
        }`}
      >
        {meta.touched && meta.error ? meta.error : title}
      </label>
    </div>
  );
};

export default Input;
