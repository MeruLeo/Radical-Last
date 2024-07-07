import FormComponent from "../../form/form.jsx";
import NormalBtn from "../../butttons/Normal/NormalBtn.jsx";

export const NewElm = ({ input, submitNew, clickEvent }) => {
  return (
    <FormComponent
      inputs={input}
      btn={<NormalBtn title={`ثبت`} path={submitNew} type="button" />}
      onSubmit={clickEvent}
    />
  );
};

export default NewElm;
