import { Formik, Form } from "formik";
import * as Yup from "yup";
import BigInput from "./input/BigInput.jsx";

const BigForm = ({ inputs, btn, onSubmit }) => {
  const validationSchema = Yup.object().shape(
    inputs.reduce((acc, input) => {
      acc[input.name] = input.validationSchema;
      return acc;
    }, {})
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
              <BigInput
                title={input.title}
                name={input.name}
                type={input.type}
                generateValue={input.generateValue} // Pass generateValue to Input
              />
            </div>
          ))}
          <div className="mt-10">{btn}</div>
        </Form>
      )}
    </Formik>
  );
};

export default BigForm;
