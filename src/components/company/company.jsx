import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Header from "../header/Header";
import NormalBtn from "../butttons/Normal/NormalBtn";
import FormComponent from "../form/form";
import Notifcation from "../notifcation/Notifcation";
import { useNavigate } from "react-router-dom";

const CompanyInfo = () => {
  const [isChecked, setIsChecked] = useState(Array(5).fill(false));
  const [notifcation, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState("فایلی انتخاب نشده است");
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

  const resetFormData = () => {
    setFormData({
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
  };

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

  const handleCheck = (index) => {
    const newIsChecked = [...isChecked];
    newIsChecked[index] = !newIsChecked[index];
    setIsChecked(newIsChecked);
    newIsChecked.forEach((check) => {
      let checkValue = check;
      console.log(checkValue);
    });
  };

  const CheckBox = ({ title, index }) => {
    return (
      <li className="relative top-4 m-1">
        <input
          type="checkbox"
          className="hidden"
          checked={isChecked[index]}
          onChange={() => handleCheck(index)}
          name={title}
          id={`checkbox-${index}`}
        />
        <label
          htmlFor={`checkbox-${index}`}
          className={`text-background-white border-1 transition-all duration-200 hover:border-background-elm w-fit p-4 cursor-pointer rounded-xl ${
            isChecked[index]
              ? "border-background-elm bg-background-elm"
              : "bg-background-elm2 border-background-elm2"
          }`}
        >
          {title}
        </label>
      </li>
    );
  };

  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const ID_user = Number(localStorage.getItem("userId"));
    const dataToSend = {
      ID_user: ID_user,
      name: formData.companyname,
      year: formData.yearofbi,
      size: formData.sizeofcompany,
      address: formData.address,
      start_market: formData.startedwork,
      vision_market: formData.eyework,
      web_site: formData.website,
    };
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/company", dataToSend);
      console.log("Data submitted successfully:", response.data);
      navigate("/services")
      resetFormData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const HistoryOfCompany = () => {
    return (
      <InfoTemplate
        title="سابقه شرکت"
        desc="کدوم یکی از موارد زیر رو برای محصول تون از قبل انجام دادید؟"
        inputs={
          <ul className="flex justify-center flex-wrap mt-4 items-center">
            {inputFieldes[0].map((option, index) => (
              <CheckBox title={option.title} index={index} key={index} />
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
          <span className={`${descDisplay} text-md bg-background-elm text-background-white rounded-full p-2`}>
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
        <InfoTemplate title="مختصات محصول" desc="به سوالات زیر پاسخ ترجیحا کوتاه یا متوسط بدهید." />
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
                onChange={(e) => setSelectedFile(e.target.files[0] || "هنوز فایلی انتخاب نشده")}
                hidden
              />
              <label
                htmlFor="custom-input"
                className="block text-sm text-background-org mr-4 py-2 px-4 rounded-md border-0 font-semibold bg-background-elm hover:bg-background-white transition-all duration-200 cursor-pointer"
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
    <div className="rounded-3xl p-4 max-w-100 w-fit flex flex-col justify-center items-center absolute top-[10%] left-[50%] translate-x-[-50%] translate-y-[-10%]">
      <Header
        title="رادیکال"
        desc="سابقه خود را در فعالیت شرکت های مختلف بنویسید"
        content={
          <p>
            <FormComponent 
            inputs={inputFieldes[1]}
            btn={<NormalBtn title="ثبت اطلاعات" />}
            onSubmit={handleSubmit}/>
          </p>
        }
      />
    </div>
  );
};

export default CompanyInfo;
