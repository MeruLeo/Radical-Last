import React, { useState, useEffect } from "react";
import axios from 'axios'; // اضافه کردن axios برای درخواست‌های HTTP
import Toggle from "../../toggle/Toggle";
import AdminHeader from "../header/Header";
import EnterCode from "../elements/EnterCode";
import ContextMenu from "../elements/ContextMenu";
import NewElm from "../elements/NewElm.jsx";
import * as Yup from "yup";
import MagicBtn from "../../butttons/magic/Magic.jsx";

const EnterCodes = () => {
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
  });

  const [loginCodes, setLoginCodes] = useState([]);

  useEffect(() => {
    // Function to fetch login codes data from API
    const fetchLoginCodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin_loginCode');
        setLoginCodes(response.data);
      } catch (error) {
        console.error('Error fetching login codes:', error);
      }
    };

    fetchLoginCodes();
  }, []);

  // State to hold generated code
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleContextMenu = (x, y, currentItem) => {
    setContextMenu({
      visible: true,
      x,
      y,
      currentItem,
    });
  };

  const generateCode = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    return randomCode;
  };

  const contextMenuValues = [
    {
      title: "ویرایش",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      onClick: () => alert("Edit clicked!"),
    },
    {
      title: "افزایش نفرات",
      icon: <i className="fa-solid fa-person-circle-plus"></i>,
      onClick: () => alert("Increase users clicked!"),
    },
    {
      title: "افزایش اعتبار",
      icon: <i className="fa-solid fa-calendar-plus"></i>,
      onClick: () => alert("Increase validity clicked!"),
    },
    {
      title: "حذف",
      icon: <i className="fa-solid fa-trash-can"></i>,
      onClick: () => alert("Delete clicked!"),
    },
  ];

  const handleSubmit = async (formData) => {
    const { new_enter_code, count_people, date_limit } = formData;
  
    try {
      // تبدیل تاریخ به فرمت صحیح برای دیتابیس
      // const formattedDate = new Date(date_limit).toISOString().split('T')[0];
  
      // ارسال درخواست به سمت سرور
      const response = await axios.post('http://localhost:5000/api/save_loginCode', {
        ID: new_enter_code,
        number: count_people,
        end_date: date_limit,
        numebr_limit:0,
      });
  
      if (response.data.success) {
        console.log('Login code saved successfully');
      } else {
        console.error('Failed to save login code:', response.data.error);
      }
    } catch (error) {
      console.error('Error while saving login code:', error.message || error);
    }
  };
  
  
  
  

  return (
    <>
      <AdminHeader />
      <Toggle
        first={`actives`}
        secend={`new`}
        firstTitle={`کد های فعال`}
        secendTitle={`کد جدید`}
        top={100}
        onToggle={(value) => setSelected(value)}
      />
      {selected === "actives" ? (
        <ul className="absolute bg-background-elm2 rounded-3xl top-56 right-[50%] translate-x-[50%]">
          {contextMenu.visible && (
            <ContextMenu
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              contextMenuValues={contextMenuValues}
            />
          )}
          {loginCodes.map((loginCode, index) => (
            <EnterCode
              key={index}
              title={loginCode.loginCode_ID}
              userLimit={loginCode.number_loginCode}
              currentUsers={loginCode.numberLimit_loginCode}
              dateLimit={loginCode.endDate_loginCode}
              onContextMenu={handleContextMenu}
              renderAdditionalContent={() => <span></span>}
            />
          ))}
        </ul>
      ) : (
        <div className="relative top-56 flex flex-col justify-center items-center">
          <NewElm
            clickEvent={handleSubmit}
            input={[
              {
                title: "کد ورود جدید",
                name: "new_enter_code",
                type: "text",
                validationSchema: Yup.string()
                  .min(5, "لطفا پنج عدد وارد کنید")
                  .max(5, "لطفا پنج عدد وارد کنید")
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "", // Display generated code if available
              },
              {
                title: "تعداد نفرات",
                name: "count_people",
                type: "number",
                validationSchema: Yup.number()
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "", // Display generated code if available
              },
              {
                title: "تاریخ اعتبار",
                name: "date_limit",
                type: "date",
                validationSchema: Yup.string()
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "", // Display generated code if available
              },
            ]}
            submitNew={`#`}
          />

          <MagicBtn title={`ساخت خودکار`} autoCode={generateCode} />
        </div>
      )}
    </>
  );
};

export default EnterCodes;
