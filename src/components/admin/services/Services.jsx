import React, { useState, useEffect, useRef } from "react";
import Toggle from "../../toggle/Toggle";
import AdminHeader from "../header/Header";
import EnterCode from "../elements/EnterCode";
import ContextMenu from "../elements/ContextMenu";
import formatPrice from "../../formatingPrice";
import "./Services.css";

const HeaderServices = () => {
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
  });

  const enterCodesValues = [
    {
      title: "ادمین اینستاگرام",
      price: formatPrice(120000),
      canEdit: false,
    },
    {
      title: "ادمین اینستاگرام",
      price: formatPrice(120000),
      canEdit: false,
    },
    {
      title: "ادمین اینستاگرام",
      price: formatPrice(120000),
      canEdit: false,
    },
    {
      title: "ادمین اینستاگرام",
      price: formatPrice(120000),
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

  const contextMenuValues = [
    {
      title: "ویرایش",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      onClick: () => alert("Edit clicked!"),
    },
    {
      title: "تغییر قیمت",
      icon: (
        <i className="fi fi-sr-refund-alt flex justify-center items-center text-xl"></i>
      ),
      onClick: () => alert("Change price clicked!"),
    },
    {
      title: "جستجوی خدمات",
      icon: (
        <i className="fi fi-sr-category flex justify-center items-center text-xl"></i>
      ),
      onClick: () => alert("Search services clicked!"),
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
        firstTitle={`سرویس های فعال`}
        secendTitle={`سرویس جدید`}
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
              price={enterCodesValue.price}
              hide={`hidden`}
              onContextMenu={handleContextMenu}
              renderAdditionalContent={() => <span></span>}
            />
          ))}
        </ul>
      ) : (
        <div className="relative top-56">
          <h1>true</h1>
        </div>
      )}
    </>
  );
};

export default HeaderServices;
