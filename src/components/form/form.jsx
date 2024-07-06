import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "./input/Input.jsx";
import NormalBtn from "../butttons/Normal/NormalBtn.jsx";

const FormComponent = ({ inputs, btn, onSubmit }) => {
  const validationSchema = Yup.object().shape(
    inputs.reduce((acc, input) => {
      acc[input.name] = input.validationSchema;
      return acc;
    }, {}),
  );

  const initialValues = inputs.reduce((acc, input) => {
    acc[input.name] = input.initialValue || "";
    return acc;
  }, {});

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="w-full max-w-sm mx-auto flex flex-col items-center">
          {inputs.map((input, index) => (
            <div key={index}>
              <Input
                title={input.title}
                name={input.name}
                type={input.type}
                generateValue={input.generateValue}
                display={input.display}
              />
            </div>
          ))}
          <div className="mt-10">{btn}</div>
        </Form>
      )}
    </Formik>
  );
};

export default FormComponent;
