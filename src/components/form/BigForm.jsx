import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "./input/Input";
import NormalBtn from "../butttons/Normal/NormalBtn";
import BigInput from "./input/BigInput";

const BingForm = ({ inputs, btn, onSubmit, formData, handleInputChange }) => {
  const validationSchema = Yup.object(
    inputs.reduce((acc, input) => {
      acc[input.name] = input.validationSchema;
      return acc;
    }, {}),
  );

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {() => (
        <Form className="w-full max-w-sm mx-auto flex flex-col items-center">
          {inputs.map((input, index) => (
            <div key={index}>
              <BigInput
                title={input.title}
                name={input.name}
                type={input.type}
                value={formData[input.name]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <div className="mt-10">{btn}</div>
        </Form>
      )}
    </Formik>
  );
};

export default BingForm;
