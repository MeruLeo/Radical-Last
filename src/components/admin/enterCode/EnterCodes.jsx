import React, { useState, useEffect } from "react";
import axios from 'axios';
import Toggle from "../../toggle/Toggle";
import AdminHeader from "../header/Header";
import EnterCode from "../elements/EnterCode";
import ContextMenu from "../elements/ContextMenu";
import NewElm from "../elements/NewElm.jsx";
import * as Yup from "yup";
import MagicBtn from "../../butttons/magic/Magic.jsx";
import convertToJalali from "../../dateJalali/dateExchange.jsx";
import Popup from "../../popup/Popup.jsx";
import Notifcation from "../../notifcation/Notifcation.jsx";

const EnterCodes = () => {
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
  });
  const [notifcation, setNotification] = useState(null); 
  const [loginCodes, setLoginCodes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", inputs: [], onSubmit: null });
  const [generatedCode, setGeneratedCode] = useState(null);

  useEffect(() => {
    const fetchLoginCodes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/admin_loginCode');
        setLoginCodes(response.data);
      } catch (error) {
        console.error('Error fetching login codes:', error);
      }
    };
    fetchLoginCodes();
  }, []);

  const handleContextMenu = (x, y, currentItem, number_loginCode) => {
    setContextMenu({
      visible: true,
      x,
      y,
      currentItem,
      number_loginCode,
    });
  };

  const generateCode = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    return randomCode;
  };

  const handleSubmit = async (formData) => {
    const { new_enter_code, count_people, date_limit } = formData;
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/save_loginCode', {
        ID: new_enter_code,
        number: count_people,
        end_date: date_limit,
      });

      if (response.data.success) {
        setNotification({
          icon: "check",
          content: "کد ورود جدید با موفقیت اضافه شد",
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({
          icon: "xmark",
          content: "کد ورود جدید شما از قبل تعریف شده است",
          iconColor: "text-red-500",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error while saving login code:', error.message || error);
    }
  };

  const handleEditLoginCodeSubmit = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/edit_loginCode', {
        old_code: contextMenu.currentItem,
        new_code: values['edit-login-code'],
      });
      if (response.data.success) {
        setNotification({
          icon: "xmark",
          content: "ویرایش با موفقیت انجام شد",
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setLoginCodes(loginCodes.map(loginCode => 
          loginCode.loginCode_ID === contextMenu.currentItem
          ? { ...loginCode, loginCode_ID: values['edit-login-code'] }
          : loginCode
        ));
        setShowPopup(false);
      } else {
        setNotification({
          icon: "times",
          content: "خطا در ارتباط با سرور",
          iconColor: "text-red-500",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error updating login code:', error);
    }
  };

  const handleIncreaseUsersSubmit = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/increase_users_log', {
        code: contextMenu.currentItem,
        new_number: values['count-people'],
      });
      if (response.data.success) {
        setNotification({
          icon: "xmark",
          content: "افزایش نفرات با موفقیت انجام شد",
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setLoginCodes(loginCodes.map(loginCode => 
          loginCode.loginCode_ID === contextMenu.currentItem
          ? { ...loginCode, number_loginCode: values['count-people'] }
          : loginCode
        ));
        setShowPopup(false);
      } else {
        setNotification({
          icon: "times",
          content: "خطا در ارتباط با سرور",
          iconColor: "text-red-500",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error('Error updating user limit:', error);
    }
  };

  const handleIncreaseValiditySubmit = async (values) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/increase_validity_log', {
        code: contextMenu.currentItem,
        new_date: values['end_date'],
      });
      if (response.data.success) {
        setNotification({
          icon: "check",
          content: "افزایش اعتبار با موفقیت انجام شد",
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setLoginCodes(loginCodes.map(loginCode => 
          loginCode.loginCode_ID === contextMenu.currentItem
          ? { ...loginCode, endDate_loginCode: values['end_date'] }
          : loginCode
        ));
        setShowPopup(false);
      } else {
        alert('Failed to update validity');
      }
    } catch (error) {
      console.error('Error updating validity:', error);
    }
  };

  const handleDeleteLoginCode = async () => {
    try {
      const response = await axios.delete('http://127.0.0.1:5000/api/delete_loginCode', {
        data: { code: contextMenu.currentItem }
      });
      if (response.data.success) {
        setNotification({
          icon: "xmark",
          content: `کد ورود${contextMenu.currentItem} با موفقیت حذف شود`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setLoginCodes(loginCodes.filter(loginCode => loginCode.loginCode_ID !== contextMenu.currentItem));
      } else {
        alert('Failed to delete login code');
      }
    } catch (error) {
      console.error('Error deleting login code:', error);
    }
  };
  

  const contextMenuValues = [
    {
      title: "ویرایش",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      onClick: () => {
        setPopupContent({
          title: `ویرایش کد ورود`,
          inputs: [
            {
              title: "کد ورود جدید",
              name: "edit-login-code",
              type: "text",
              validationSchema: Yup.string()
                .min(5, "لطفا  5 رقم وارد کنید")
                .max(5, "لطفا  5 رقم وارد کنید")
                .required("این فیلد اجباری است"),
              initialValue: contextMenu.currentItem,
            },
          ],
          onSubmit: handleEditLoginCodeSubmit,
        });
        setShowPopup(true);
      },
    },
    {
      title: "افزایش نفرات",
      icon: <i className="fa-solid fa-person-circle-plus"></i>,
      onClick: () => {
        setPopupContent({
          title: "ویرایش تعداد نفرات",
          inputs: [
            {
              title: "تعداد نفرات جدید",
              name: "count-people",
              type: "number",
              validationSchema: Yup.number()
                .required("This field is required"),
              initialValue: contextMenu.number_loginCode,
            },
          ],
          onSubmit: handleIncreaseUsersSubmit,
        });
        setShowPopup(true);
      },
    },
    {
      title: "افزایش اعتبار",
      icon: <i className="fa-solid fa-calendar-plus"></i>,
      onClick: () => {
        setPopupContent({
          title: "تاریخ اعتبار جدید",
          inputs: [
            {
              title: "",
              name: "end_date",
              type: "date",
              validationSchema: Yup.string()
                .required("This field is required"),
              initialValue: contextMenu.currentItem.endDate_loginCode,
            },
          ],
          onSubmit: handleIncreaseValiditySubmit,
        });
        setShowPopup(true);
      },
    },
    {
      title: "حذف",
      icon: <i className="fa-solid fa-trash-can"></i>,
      onClick: handleDeleteLoginCode,
    },
  ];

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
        <ul className="relative bg-background-elm2 w-fit p-1 rounded-3xl top-56 right-[50%] translate-x-[50%]">
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
              dateLimit={convertToJalali(loginCode.endDate_loginCode)}
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
                initialValue: generatedCode || "",
              },
              {
                title: "تعداد نفرات",
                name: "count_people",
                type: "number",
                validationSchema: Yup.number()
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "",
              },
              {
                title: "",
                name: "date_limit",
                type: "date",
                validationSchema: Yup.string()
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "",
              },
            ]}
            submitNew={`#`}
          />
          <MagicBtn title={`ساخت خودکار`} autoCode={generateCode} />
        </div>
      )}
      {showPopup && (
        <Popup
          title={popupContent.title}
          inputs={popupContent.inputs}
          handleSubmit={popupContent.onSubmit}
          onClose={() => setShowPopup(false)}
        />
      )}
      {notifcation && (
        <Notifcation
          icon={notifcation.icon}
          content={notifcation.content}
          iconColor={notifcation.iconColor}
        />
      )}
    </>
  );
};

export default EnterCodes;
