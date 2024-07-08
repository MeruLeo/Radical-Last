import React from "react";
import { motion } from "framer-motion";
import FormComponent from "../form/form.jsx";
import NormalBtn from "../butttons/Normal/NormalBtn.jsx";

const Popup = ({ title, inputs, onClose, handleSubmit }) => {

  return (
    <motion.div
      className="fixed inset-0 bg-opacity-90 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-background-org border-1 border-background-elm rounded-3xl p-4 w-96"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
      >
        <div className="flex text-background-white justify-between items-center mb-4">
          <h2 className="text-xl">{title}</h2>
          <button onClick={onClose} className="text-red-500">
            <i className="fi fi-tr-circle-xmark text-3xl"></i>
          </button>
        </div>
        <FormComponent
          inputs={inputs}
          btn={<NormalBtn title={`ثبت`} path={`#`} />}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </motion.div>
  );
};

export default Popup;
