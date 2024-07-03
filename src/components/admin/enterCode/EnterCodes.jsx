import React, { useState } from "react";
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

  // State to hold generated code
  const [generatedCode, setGeneratedCode] = useState(null);

  const enterCodesValues = [
    {
      title: "19456",
      userLimit: 60,
      currentUsers: 60,
      dateLimit: "1403/04/13",
      canEdit: false,
    },
    {
      title: "12345",
      userLimit: 10,
      currentUsers: 1,
      dateLimit: "1403/06/03",
      canEdit: false,
    },
    {
      title: "76835",
      userLimit: 7,
      currentUsers: 3,
      dateLimit: "1403/12/01",
      canEdit: false,
    },
    {
      title: "95334",
      userLimit: 25,
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
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    return randomCode
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

export default EnterCodes;
