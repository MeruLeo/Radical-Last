import React, { useState, useEffect, useRef } from "react";
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

  const enterCodesValues = [
    {
      title: "A532l",
      userLimit: 100,
      currentUsers: 60,
      dateLimit: "1403/04/13",
      canEdit: false,
    },
    {
      title: "MK099",
      userLimit: 25,
      currentUsers: 10,
      dateLimit: "1403/06/03",
      canEdit: false,
    },
    {
      title: "T77TY",
      userLimit: 50,
      currentUsers: 3,
      dateLimit: "1403/12/01",
      canEdit: false,
    },
    {
      title: "RAR43",
      userLimit: 20,
      currentUsers: 20,
      dateLimit: "1403/04/05",
      canEdit: false,
    },
  ];

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
          {enterCodesValues.map((enterCodesValue, index) => (
            <EnterCode
              key={index}
              title={enterCodesValue.title}
              userLimit={enterCodesValue.userLimit}
              currentUsers={enterCodesValue.currentUsers}
              dateLimit={enterCodesValue.dateLimit}
              onContextMenu={handleContextMenu}
              renderAdditionalContent={() => <span></span>}
            />
          ))}
        </ul>
      ) : (
        <div className="relative top-56 flex flex-col justify-center items-center">
          <NewElm
            input={[
              {
                title: "کد ورود جدید",
                name: "new-enter-code",
                type: "text",
                validationSchema: Yup.string()
                  .min(5, "لطفا پنج عدد وارد کنید")
                  .max(5, "لطفا پنج عدد وارد کنید")
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

export default OfferCodes;
