import React, { useState, useEffect } from "react";
import axios from 'axios'; // اضافه کردن axios برای درخواست‌های HTTP
import Toggle from "../../toggle/Toggle";
import AdminHeader from "../header/Header";
import EnterCode from "../elements/EnterCode";
import ContextMenu from "../elements/ContextMenu";
import NewElm from "../elements/NewElm.jsx";
import * as Yup from "yup";
import MagicBtn from "../../butttons/magic/Magic.jsx";

const OfferCodes = () => {
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
  });

  const [generatedCode, setGeneratedCode] = useState(null);
  const [offerCodes, setOfferCodes] = useState([]); // اضافه کردن حالت برای نگهداری داده‌های دریافت شده

  useEffect(() => {
    // Function to fetch offer codes data from API
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
        alert("Offer code saved successfully!");
      } else {
        alert("Error saving offer code: " + response.data.error);
      }
    } catch (error) {
      console.error('Error saving offer code:', error);
    }
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
        <ul className="absolute bg-background-elm2 rounded-3xl top-56 right-[50%] translate-x-[50%]">
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
              dateLimit={offerCode.endDate_offerCode}
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
                title: "کد تخفیف جدید",
                name: "new-offer-code",
                type: "text",
                validationSchema: Yup.string()
                  .min(5, "لطفا پنج عدد وارد کنید")
                  .max(5, "لطفا پنج عدد وارد کنید")
                  .required("این فیلد اجباری است"),
                initialValue: generatedCode || "", // Display generated code if available
              },
              {
                title: "تعداد نفرات",
                name: "count-people1",
                type: "number",
                validationSchema: Yup.number()
                  .required("این فیلد اجباری است"),
                initialValue: "", // Default value
              },
              {
                title: "قیمت تخفیف",
                name: "offer_price",
                type: "number",
                validationSchema: Yup.number()
                  .required("این فیلد اجباری است"),
                initialValue: "", // Default value
              },
              {
                title: "تاریخ اعتبار",
                name: "end_date",
                type: "date",
                validationSchema: Yup.string()
                  .required("این فیلد اجباری است"),
                initialValue: "", // Default value
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

export default OfferCodes;
