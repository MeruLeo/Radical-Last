import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Header from "../header/Header";
import NormalBtn from "../butttons/Normal/NormalBtn";
import BigForm from "../form/BigForm";

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

  const handleCheck = (id) => {
    setIsChecked((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((checkedId) => checkedId !== id)
        : [...prevChecked, id]
    );
  };

  const CheckBox = ({ title, id }) => {
    return (
      <li className="relative top-4 m-1">
        <input
          type="checkbox"
          className="hidden"
          checked={isChecked.includes(id)}
          onChange={() => handleCheck(id)}
          name={title}
          id={id}
        />
        <label
          htmlFor={id}
          className={`text-background-white border-1 transition-all duration-200 hover:border-background-elm w-fit p-4 cursor-pointer rounded-xl ${
            isChecked.includes(id)
              ? "border-background-elm bg-background-elm"
              : "bg-background-elm2 border-background-elm2"
          }`}
        >
          {title}
        </label>
      </li>
    );
  };

  const HistoryOfCompany = () => {
    return (
      <InfoTemplate
        title="سابقه شرکت"
        desc="کدوم یکی از موارد زیر رو برای محصول تون از قبل انجام دادید؟"
        inputs={
          <ul className="flex justify-center flex-wrap mt-4 items-center">
            {inputFieldes[0].map((option, index) => (
              <CheckBox
                title={option.title}
                id={`option-${index + 1}`}
                key={index}
              />
            ))}
          </ul>
        }
      />
    );
  };

  const InfoTemplate = ({ title, inputs, desc, descDisplay }) => {
    return (
      <div className="p-2 relative top-3 mb-4">
        <header className="text-background-white text-3xl">
          <h2 className="mb-4 mt-10">{title}</h2>
        </header>
        <main>
          <span
            className={`${descDisplay} text-md bg-background-elm text-background-white rounded-full p-2`}
          >
            <i className="fa-solid fa-circle-info ml-2"></i>
            {desc}
          </span>
          {inputs}
        </main>
      </div>
    );
  };

  const ProductCoordinates = () => {
    return (
      <>
        <InfoTemplate
          title="مختصات محصول"
          desc="به سوالات زیر پاسخ ترجیحا کوتاه یا متوسط بدهید."
        />
      </>
    );
  };

  const Strategy = () => {
    return (
      <>
        <InfoTemplate
          title="استراتژی بازاریابی شما"
          desc="هر مورد که بالا نمی شد توضیح بدید،در کنار بازاریابیتون بنویسید."
        />
      </>
    );
  };

  const PdfInput = () => {
    return (
      <InfoTemplate
        title="ارسال پی دی اف"
        desc="یک فایل پی دی اف حاوی اطلاعات مورد نیاز ارسال کنید"
        inputs={
          <form>
            <div className="flex flex-row items-center justify-evenly m-4">
              <input
                type="file"
                id="custom-input"
                onChange={(e) =>
                  setSelectedFile(e.target.files[0] || "هنوز فایلی انتخاب نشده")
                }
                hidden
              />
              <label
                htmlFor="custom-input"
                className="block text-sm text-background-org mr-4 py-2 px-4
                rounded-md border-0 font-semibold bg-background-elm
                hover:bg-background-white transition-all duration-200 cursor-pointer"
              >
                <i className="fa-solid fa-paperclip ml-2"></i>
                انتخاب فایل
              </label>
              <label className="text-sm text-background-elm">
                {selectedFile.name || "هنوز فایلی انتخاب نشده"}
              </label>
            </div>
          </form>
        }
      />
    );
  };

  return (
    <div className="rounded-3xl p-4 max-w-100 w-fit flex flex-col justify-center items-center absolute top-[30%] left-[50%] translate-x-[-50%] translate-y-[-10%]">
      <Header
        title="رادیکال"
        desc="سابقه خود را در فعالیت شرکت های مختلف بنویسید"
        content={
          <form >
            <HistoryOfCompany />
            <ProductCoordinates />
            <BigForm
              inputs={inputFieldes[2]}
              handleInputChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              formData={formData}
            />
            <Strategy />
            <BigForm
              inputs={inputFieldes[3]}
              handleInputChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              formData={formData}
            />
            <PdfInput />
            <BigForm
              inputs={inputFieldes[1]}
              handleInputChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
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
