import React from "react";
import NormalBtn from "../butttons/Normal/NormalBtn";
import FormComponent from "../form/form";
import Notifcation from "../notifcation/Notifcation";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../butttons/Normal/NormalBtn.css";
import Header from "../header/Header";

const Start = () => {
  const navigate = useNavigate(); // استفاده از useNavigate برای هدایت

  const componentInputs = [
    {
      title: "کد ورودی",
      name: "entercode",
      type: "number",
      validationSchema: Yup.string()
        .matches(/^\d{5}$/, "لطفا کد پنج رقمی وارد کنید")
        .required("این فیلد اجباری است"),
      initialValue: "",
    },
  ];

  const handleSubmit = (values) => {
    const { entercode } = values;

    const convertValue = JSON.stringify(values.entercode);
    localStorage.setItem("entercode", convertValue);

    axios
      .post("http://127.0.0.1:5000/api/check_code", { code: entercode })
      .then((response) => {
        if (response.data.exists) {
          navigate("/register");
        } else {
          <Notifcation content={`کد وارد شده صحیح نیست`} icon={`xmark`} />;
        }
      })
      .catch((error) => {
        console.error("Error checking the code", error);
        <Notifcation
          content={`خطایی در ارتباط با سرور رخ داده است`}
          icon={`xmark`}
        />;
      });
  };

  return (
    <>
      <div className="rounded-3xl p-4 max-w-60 w-fit flex flex-col justify-center items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Header
          title={`رادیکال`}
          desc={`رادیکال، سامانه ای برای انجام خدمات تکنولوژی`}
          content={
            <FormComponent
              inputs={componentInputs}
              btn={<NormalBtn title={`ورود به رادیکال`} />}
              onSubmit={handleSubmit}
            />
          }
        />
      </div>
    </>
  );
};

export default Start;
