import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Header from "../header/Header";
import NormalBtn from "../butttons/Normal/NormalBtn";
import BigForm from "../form/BigForm";
import FormComponent from "../form/form";

const CompanyInfo = () => {
  const [isChecked, setIsChecked] = useState([]);
  const [selectedFile, setSelectedFile] = useState("No file chosen");
  const [formData, setFormData] = useState({
    companyname: "",
    yearofbi: "",
    sizeofcompany: "",
    address: "",
    startedwork: "",
    eyework: "",
    website: "",
    productimportant: "",
    strongers: "",
    theenemy: "",
    forcustomers: "",
    strategy: "",
  });

  const inputFieldes = [
    [
      { title: "لوگو" },
      { title: "شعار" },
      { title: "رنگ" },
      { title: "المان های شخصیتی" },
      { title: "تبلیغات " },
    ],
    [
      {
        title: "نام شرکت",
        name: "companyname",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.companyname,
      },
      {
        title: "سال تاسیس کسب و کار",
        name: "yearofbi",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.yearofbi,
      },
      {
        title: "سایز شرکت",
        name: "sizeofcompany",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.sizeofcompany,
      },
      {
        title: "آدرس",
        name: "address",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.address,
      },
      {
        title: "بازار شروع کار",
        name: "startedwork",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.startedwork,
      },
      {
        title: "بازار چشم انداز",
        name: "eyework",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.eyework,
      },
      {
        title: "وبسایت",
        name: "website",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.website,
      },
    ],
    [
      {
        title: "مهم ترین بخش این محصول چیه؟",
        name: "productimportant",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.productimportant,
      },
      {
        title: "در چه بخش از محصول خودتون را قوی تر می بینید؟",
        name: "strongers",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.strongers,
      },
      {
        title: "مهم ترین رقیب برای بخش مهم محصول چه شرکتیه؟",
        name: "theenemy",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.theenemy,
      },
      {
        title: "بهترین کارکرد این محصول برای مشتری چیه؟",
        name: "forcustomers",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.forcustomers,
      },
    ],
    [
      {
        title: "استراتژی بازاریابی",
        name: "strategy",
        type: "text",
        validationSchema: Yup.string().required("این فیلد اجباری است"),
        initialValue: formData.strategy,
      },
    ],
  ];

  // const handleCheck = (id) => {
  //   setIsChecked((prevChecked) =>
  //     prevChecked.includes(id)
  //       ? prevChecked.filter((checkedId) => checkedId !== id)
  //       : [...prevChecked, id]
  //   );
  // };

  // const CheckBox = ({ title, id }) => {
  //   return (
  //     <li className="relative top-4 m-1">
  //       <input
  //         type="checkbox"
  //         className="hidden"
  //         checked={isChecked.includes(id)}
  //         onChange={() => handleCheck(id)}
  //         name={title}
  //         id={id}
  //       />
  //       <label
  //         htmlFor={id}
  //         className={`text-background-white border-1 transition-all duration-200 hover:border-background-elm w-fit p-4 cursor-pointer rounded-xl ${
  //           isChecked.includes(id)
  //             ? "border-background-elm bg-background-elm"
  //             : "bg-background-elm2 border-background-elm2"
  //         }`}
  //       >
  //         {title}
  //       </label>
  //     </li>
  //   );
  // };

  return (
    <div className="rounded-3xl p-4 max-w-100 w-fit flex flex-col justify-center items-center absolute top-[10%] left-[50%] translate-x-[-50%] translate-y-[-10%]">
      <Header
        title="رادیکال"
        desc="سابقه خود را در فعالیت شرکت های مختلف بنویسید"
        content={
          <form>
            <FormComponent
              inputs={inputFieldes[1]}
              formData={formData}
              btn={<NormalBtn title="ثبت اطلاعات" />}
            />
          </form>
        }
      />
    </div>
  );
};

export default CompanyInfo;
