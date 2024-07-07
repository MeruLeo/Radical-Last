import React, { useState, useEffect } from "react";
import Toggle from "../../toggle/Toggle";
import AdminHeader from "../header/Header";
import EnterCode from "../elements/EnterCode";
import ContextMenu from "../elements/ContextMenu";
import formatPrice from "../../formatingPrice";
import "./Services.css";
import FormComponent from "../../form/form";
import NormalBtn from "../../butttons/Normal/NormalBtn";
import * as Yup from "yup";

const HeaderServices = () => {
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
  });
  const [enterCodesValues, setEnterCodesValues] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/show_services')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(service => ({
          title: service.service_name,
          price: formatPrice(service.service_price),
          canEdit: false,
        }));
        setEnterCodesValues(formattedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleContextMenu = (x, y, currentItem) => {
    setContextMenu({
      visible: true,
      x,
      y,
      currentItem,
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/save_service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values['service-title'],
          price: values['service-price'],
        }),
      });

      if (response.ok) {
        alert('Service saved successfully!');
        // Optional: update the list of services by refetching
      } else {
        alert('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('An error occurred');
    }
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

  const componentInputs = [
    {
      title: "عنوان سرویس",
      name: "service-title",
      type: "text",
      validationSchema: Yup.string().required("این فیلد اجباری است"),
      initialValue: "",
    },
    {
      title: "قیمت سرویس",
      name: "service-price",
      type: "number",
      validationSchema: Yup.number().required("این فیلد اجباری است"),
      initialValue: "",
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
          <FormComponent
            inputs={componentInputs}
            btn={<NormalBtn title={`ثبت`} />}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </>
  );
};

export default HeaderServices;
