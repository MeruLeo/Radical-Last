import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Yup from "yup";
import AdminHeader from "./header/Header";
import "./Admin.css";
import FormComponent from "../form/form.jsx";
import NormalBtn from "../butttons/Normal/NormalBtn.jsx";

const Admin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", inputs: [] });

  const colorClassMap = {
    "red-500": "border-red-500 bg-red-500",
    "blue-500": "border-blue-500 bg-blue-500",
    "green-500": "border-green-500 bg-green-500",
    "yellow-500": "border-yellow-500 bg-yellow-500",
  };

  const adminLinks = [
    {
      icon: (
        <i className="fi fi-ts-binary flex items-center justify-center"></i>
      ),
      title: "مدیریت کد های ورود",
      content: "کد های ورود خود مدیریت کنید یا کد جدید ایجاد کنید.",
      path: "/admin/enter-code",
      color: "red-500",
    },
    {
      icon: (
        <i className="fi fi-tr-badge-percent flex items-center justify-center"></i>
      ),
      title: "مدیریت کد های تخفیف",
      content:
        "به کاربران خود کد تخفیف هدیه دهید و آنها را از اینجا مدیریت کنید.",
      path: "/admin/discount-code",
      color: "blue-500",
    },
    {
      icon: (
        <i className="fi fi-ts-order-history flex items-center justify-center"></i>
      ),
      title: "مدیریت سفارشات",
      content: "سفارشات کاربران خود را از این صفحه مدیریت کنید.",
      path: "/admin/orders",
      color: "green-500",
    },
    {
      icon: (
        <i className="fi fi-tr-customer-care flex items-center justify-center"></i>
      ),
      title: "مدیریت خدمات",
      content: "خدمات حال حاضر مجموعه را مدیریت کنید.",
      path: "/admin/services",
      color: "yellow-500",
    },
  ];

  const AdminBoxLink = ({ icon, title, content, path, color }) => {
    const colorClasses = colorClassMap[color];

    return (
      <li>
        <Link
          to={path}
          className={`block p-4 transition-all duration-200 border-3 hover:bg-background-org ${colorClasses.split(" ")[0]} m-4 bg-background-elm2 rounded-3xl`}
        >
          <header>
            <div
              className={`${colorClasses.split(" ")[1]} flex items-center justify-center p-2 w-10 h-10 rounded-full`}
            >
              {icon}
            </div>
            <h3 className="text-xl">{title}</h3>
          </header>
          <main className="text-sm">{content}</main>
        </Link>
      </li>
    );
  };

  const AdminBoxLinks = () => {
    return (
      <ul className="flex items-center w-full justify-between">
        {adminLinks.map((adminLink, index) => (
          <AdminBoxLink
            key={index}
            title={adminLink.title}
            content={adminLink.content}
            icon={adminLink.icon}
            path={adminLink.path}
            color={adminLink.color}
          />
        ))}
      </ul>
    );
  };

  const quickOptionsValue = [
    {
      title: "کد ورود جدید",
      icon: (
        <i className="fi fi-tr-rectangle-history-circle-plus flex items-center justify-center"></i>
      ),
      inputs: [
        {
          title: "کد ورودی",
          name: "entercode",
          type: "number",
          validationSchema: Yup.string()
            .matches(/^\d{5}$/, "لطفا کد پنج رقمی وارد کنید")
            .required("این فیلد اجباری است"),
          initialValue: "",
        },
        {
          title: "تاریخ اعتبار",
          name: "validitydate",
          type: "text",
          validationSchema: Yup.date().required("این فیلد اجباری است"),
          initialValue: "",
        },
        {
          title: "تعداد نفرات",
          name: "usercount",
          type: "number",
          validationSchema: Yup.number().required("این فیلد اجباری است"),
          initialValue: "",
        },
      ],
    },
    {
      title: "کد تخفیف جدید",
      icon: (
        <i className="fi fi-tr-multiple flex items-center justify-center"></i>
      ),
      inputs: [
        {
          title: "کد تخفیف",
          name: "discountcode",
          type: "text",
          validationSchema: Yup.string().required("این فیلد اجباری است"),
          initialValue: "",
        },
        {
          title: "تاریخ اعتبار",
          name: "validitydate",
          type: "text",
          validationSchema: Yup.date().required("این فیلد اجباری است"),
          initialValue: "",
        },
        {
          title: "تعداد نفرات",
          name: "usercount",
          type: "number",
          validationSchema: Yup.number().required("این فیلد اجباری است"),
          initialValue: "",
        },
      ],
    },
    {
      title: "سرویس جدید",
      icon: (
        <i className="fi fi-tr-diamond flex items-center justify-center"></i>
      ),
      inputs: [
        {
          title: "نام سرویس",
          name: "servicename",
          type: "text",
          validationSchema: Yup.string().required("این فیلد اجباری است"),
          initialValue: "",
        },
        {
          title: "تعداد نفرات",
          name: "usercount",
          type: "number",
          validationSchema: Yup.number().required("این فیلد اجباری است"),
          initialValue: "",
        },
      ],
    },
  ];

  const handleQuickOptionClick = (title, inputs) => {
    setPopupContent({ title, inputs });
    setShowPopup(true);
  };

  const QuickOption = ({ title, icon, inputs }) => {
    return (
      <li className="m-4">
        <button
          className="bg-transparent hover:bg-background-elm transition-all duration-200 flex w-52 justify-between items-center border-2 border-background-elm rounded-xl"
          onClick={() => handleQuickOptionClick(title, inputs)}
        >
          <div className="text-2xl w-10 h-10 bg-background-elm flex rounded-lg m-2 items-center justify-center">
            {icon}
          </div>
          <h4 className="ml-2">{title}</h4>
        </button>
      </li>
    );
  };

  const QuickOptions = () => {
    return (
      <ul className="flex mt-4">
        {quickOptionsValue.map((quickOptionValue, index) => (
          <QuickOption
            key={index}
            title={quickOptionValue.title}
            icon={quickOptionValue.icon}
            inputs={quickOptionValue.inputs}
          />
        ))}
      </ul>
    );
  };

  const Popup = ({ title, inputs, onClose }) => {
    const handleSubmit = (values) => {
      console.log(values);
      onClose();
    };

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

  return (
    <>
      <AdminHeader />
      <section className="relative top-32 text-background-white flex mr-4 items-center">
        <span className="ml-2 text-background-elm2">سلام</span>
        <h1 className="gradient-text text-4xl font-bold">ستاره رفیعی</h1>
      </section>
      <section className="relative top-40 text-background-white flex mr-4 items-center">
        <AdminBoxLinks />
      </section>
      <section className="relative top-52 flex flex-col text-background-white mr-4 items-start">
        <h2 className="text-[#444746] text-4xl">
          خدمات و کد های خود را سریع اضافه کنید
        </h2>
        <QuickOptions />
      </section>
      {showPopup && (
        <Popup
          title={popupContent.title}
          inputs={popupContent.inputs}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default Admin;
