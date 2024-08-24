import React, { useState, useEffect } from "react";
import axios from 'axios';
import Toggle from "../../toggle/Toggle";
import AdminHeader from "../header/Header";
import EnterCode from "../elements/EnterCode";
import ContextMenu from "../elements/ContextMenu";
import NewElm from "../elements/NewElm.jsx";
import * as Yup from "yup";
import MagicBtn from "../../butttons/magic/Magic.jsx";
import Popup from "../../popup/Popup";
import convertToJalali from "../../dateJalali/dateExchange.jsx";
import Notifcation from "../../notifcation/Notifcation.jsx";

const OfferCodes = () => {
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
  });
  const [notifcation, setNotification] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", inputs: [], onSubmit: null });
  const [generatedCode, setGeneratedCode] = useState(null);
  const [offerCodes, setOfferCodes] = useState([]);

  useEffect(() => {
    const fetchOfferCodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin_offerCode');
        setOfferCodes(response.data);
      } catch (error) {
        console.error('Error fetching offer codes:', error);
      }
    };
    fetchOfferCodes();
  }, []);

  const handleContextMenu = (x, y, currentItem) => {
    setContextMenu({
      visible: true,
      x,
      y,
      currentItem,
    });
  };

  const generateCode = () => {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/save_offerCode', {
        ID: values["new-offer-code"],
        number: values["count-people1"],
        end_date: values["end_date"],
        off_price: values["offer_price"]
      });
      if (response.data.success) {
        setNotification({
          icon: "check",
          content: `کد تخفیف جدید با موفقیت اضافه شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        alert("Error saving offer code: " + response.data.error);
      }
    } catch (error) {
      console.error('Error saving offer code:', error);
    }
  };

  const handleEditOfferCodeSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/edit_offerCode', {
        old_id: contextMenu.currentItem.offerCode_ID, // تغییر نام پارامتر به old_id
        new_id: values['edit-offer-code'], // تغییر نام پارامتر به new_id
      });
      if (response.data.success) {
        setNotification({
          icon: "check",
          content: `ویرایش با موفقیت اعمال شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setOfferCodes(offerCodes.map(offerCode => 
          offerCode.offerCode_ID === contextMenu.currentItem.offerCode_ID
          ? { ...offerCode, offerCode_ID: values['edit-offer-code'] }
          : offerCode
        ));
        setShowPopup(false);
      } else {
        alert('Failed to update offer code');
      }
    } catch (error) {
      console.error('Error updating offer code:', error);
    }
  };
  

  const handleIncreaseUsersSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/increase_users', {
        code: contextMenu.currentItem.offerCode_ID,
        new_number: values['count-people'],
      });
      if (response.data.success) {
        setNotification({
          icon: "check",
          content: `افزایش نفرات با موفقیت اعمال شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setOfferCodes(offerCodes.map(offerCode => 
          offerCode.offerCode_ID === contextMenu.currentItem.offerCode_ID
          ? { ...offerCode, number_offerCode: values['count-people'] }
          : offerCode
        ));
        setShowPopup(false);
      } else {
        alert('Failed to update user limit');
      }
    } catch (error) {
      console.error('Error updating user limit:', error);
    }
  };
  

  const handleIncreaseValiditySubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/increase_validity', {
        code: contextMenu.currentItem.offerCode_ID,
        new_date: values['end_date'],
      });
      if (response.data.success) {
        setNotification({
          icon: "check",
          content: `افزایش اعتبار با موفقیت اعمال شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setOfferCodes(offerCodes.map(offerCode => 
          offerCode.offerCode_ID === contextMenu.currentItem.offerCode_ID
          ? { ...offerCode, endDate_offerCode: values['end_date'] }
          : offerCode
        ));
        setShowPopup(false);
      } else {
        alert('Failed to update validity');
      }
    } catch (error) {
      console.error('Error updating validity:', error);
    }
  };
  

  const handleDeleteOfferCode = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/delete_offerCode', {
        data: { data: contextMenu.currentItem.offerCode_ID } // تغییر نام پارامتر به data
      });
      if (response.data.success) {
        setNotification({
          icon: "check",
          content: `کد تخفیف ${contextMenu.currentItem.offerCode_ID} حذف شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setOfferCodes(offerCodes.filter(offerCode => offerCode.offerCode_ID !== contextMenu.currentItem.offerCode_ID));
        setContextMenu({ ...contextMenu, visible: false });
      } else {
        alert('Failed to delete offer code');
      }
    } catch (error) {
      setNotification({
        icon: "xmark",
        content: "این کد درحال استفاده است!",
        iconColor: "text-red-500",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };
  

  const contextMenuValues = [
    {
      title: "ویرایش",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      onClick: () => {
        setPopupContent({
          title: `ویرایش ${contextMenu.currentItem.offerCode_ID}`,
          inputs: [
            {
              title: "کد تخفیف جدید",
              name: "edit-offer-code",
              type: "text",
              validationSchema: Yup.string().min(5, "لطفا پنج عدد وارد کنید").max(5, "لطفا پنج عدد وارد کنید").required("این فیلد اجباری است"),
              initialValue: contextMenu.currentItem.offerCode_ID,
            },
          ],
          onSubmit: handleEditOfferCodeSubmit,
        });
        setShowPopup(true);
      },
    },
    {
      title: "افزایش نفرات",
      icon: <i className="fa-solid fa-person-circle-plus"></i>,
      onClick: () => {
        setPopupContent({
          title: `افزایش نفرات ${contextMenu.currentItem.offerCode_ID}`,
          inputs: [
            {
              title: "تعداد نفرات",
              name: "count-people",
              type: "number",
              validationSchema: Yup.number().required("این فیلد اجباری است"),
              initialValue: contextMenu.currentItem.number_offerCode,
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
          title: `افزایش اعتبار ${contextMenu.currentItem.offerCode_ID}`,
          inputs: [
            {
              title: "",
              name: "end_date",
              type: "date",
              validationSchema: Yup.string().required("این فیلد اجباری است"),
              initialValue: contextMenu.currentItem.endDate_offerCode,
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
      onClick: handleDeleteOfferCode,
    },
  ];

  return (
    <>
      <AdminHeader />
      <Toggle
        first={`actives`}
        secend={`new`}
        firstTitle={`کد های فعال`}
        secendTitle={`کد تخفیف جدید`}
        top={100}
        onToggle={(value) => setSelected(value)}
      />
      {selected === "actives" ? (
        <ul className="absolute bg-background-elm2 p-1 rounded-3xl top-56 right-[50%] translate-x-[50%]">
          {contextMenu.visible && (
            <ContextMenu
              contextMenu={contextMenu}
              setContextMenu={setContextMenu}
              contextMenuValues={contextMenuValues}
            />
          )}
          {offerCodes.map((offerCode, index) => (
            <EnterCode
              key={index}
              title={offerCode.offerCode_ID}
              userLimit={offerCode.number_offerCode}
              currentUsers={offerCode.numberLimit_offerCode}
              dateLimit={convertToJalali(offerCode.endDate_offerCode)}
              onContextMenu={(x, y) => handleContextMenu(x, y, offerCode)}
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
                title: "کد تخفیف جدید",
                name: "new-offer-code",
                type: "text",
                validationSchema: Yup.string()
                  .min(5, "لطفا پنج عدد وارد کنید")
                  .max(5, "لطفا پنج عدد وارد کنید")
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "",
              },
              {
                title: "تعداد نفرات",
                name: "count-people1",
                type: "number",
                validationSchema: Yup.number()
                  .required("این فیلد اجباری است"),
                initialValue: "",
              },
              {
                title: "قیمت تخفیف",
                name: "offer_price",
                type: "number",
                validationSchema: Yup.number()
                  .required("این فیلد اجباری است"),
                initialValue: "",
              },
              {
                title: "",
                name: "end_date",
                type: "date",
                validationSchema: Yup.string()
                  .required("این فیلد اجباری است"),
                initialValue: "",
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
          onClose={() => setShowPopup(false)}
          handleSubmit={popupContent.onSubmit}
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

export default OfferCodes;
