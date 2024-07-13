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
import Popup from "../../popup/Popup";
import Notifcation from "../../notifcation/Notifcation";

const HeaderServices = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", inputs: [], onSubmit: null });
  const [selected, setSelected] = useState("actives");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    currentItem: null,
    serviceName: null,
  });
  const [notifcation, setNotification] = useState(null);
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
      serviceName: currentItem.title,
      servicePrice: currentItem.price,
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
        setNotification({
          icon: "check",
          content: `سرویس جدید با موفقیت اضافه شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        alert('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('An error occurred');
    }
  };

  const editServiceName = [
    {
      title: "عنوان جدید سرویس",
      name: "service-new-title",
      type: "text",
      validationSchema: Yup.string().required("این فیلد اجباری است"),
      initialValue: "",
    },
  ];

  const editService_Price = [
    {
      title: "قیمت جدید سرویس",
      name: "service-new-price",
      type: "number",
      validationSchema: Yup.number().required("این فیلد اجباری است"),
      initialValue: "",
    },
  ];

  const handleEditServiceSubmit = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/edit_service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_name: contextMenu.serviceName,
          new_name: values['service-new-title'],
        }),
      });

      if (response.ok) {
        setNotification({
          icon: "check",
          content: `ویرایش با موفقیت اعمال شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setEnterCodesValues(enterCodesValues.map(service => 
          service.title === contextMenu.serviceName 
          ? { ...service, title: values['service-new-title'] } 
          : service
        ));
        setShowPopup(false);
      } else {
        alert('Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      alert('An error occurred');
    }
  };

  const editService = (serviceName) => {
    setPopupContent({ 
      title: `ویرایش ${serviceName}`, 
      inputs: editServiceName, 
      onSubmit: handleEditServiceSubmit 
    });
    setShowPopup(true);
  };

  const handleEditServicePriceSubmit = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/edit_service_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contextMenu.serviceName,
          new_price: values['service-new-price'],
        }),
      });

      if (response.ok) {
        setNotification({
          icon: "check",
          content: `تغییر قیمت با موفقیت اعمال شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setEnterCodesValues(enterCodesValues.map(service => 
          service.title === contextMenu.serviceName 
          ? { ...service, price: values['service-new-price'] } 
          : service
        ));
        setShowPopup(false);
      } else {
        alert('Failed to update service price');
      }
    } catch (error) {
      console.error('Error updating service price:', error);
      alert('An error occurred');
    }
  };

  const editServicePrice = (servicePrice) => {
    setPopupContent({ 
      title: `تغییر قیمت ${contextMenu.serviceName}`, 
      inputs: editService_Price, 
      onSubmit: handleEditServicePriceSubmit
    });
    setShowPopup(true);
  };

  const deleteService = async (serviceName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/delete_service', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service_name: serviceName }),
      });

      if (response.ok) {
        setNotification({
          icon: "check",
          content: `سرویس با موفقیت حذف شد`,
          iconColor: "text-green-500",
        });
        setTimeout(() => setNotification(null), 3000);
        setEnterCodesValues(enterCodesValues.filter(service => service.title !== serviceName));
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('An error occurred');
    }
  };

  const contextMenuValues = [
    {
      title: "ویرایش",
      icon: <i className="fa-solid fa-pen-to-square"></i>,
      onClick: () => editService(contextMenu.serviceName),
    },
    {
      title: "تغییر قیمت",
      icon: (
        <i className="fi fi-sr-refund-alt flex justify-center items-center text-xl"></i>
      ),
      onClick: () => editServicePrice(contextMenu.servicePrice),
    },
    {
      title: "جستجوی خدمات",
      icon: (
        <i className="fi fi-sr-category flex justify-center items-center text-xl"></i>
      ),
      onClick: () => console.log(`Search services clicked on ${contextMenu.serviceName}`),
    },
    {
      title: "حذف",
      icon: <i className="fa-solid fa-trash-can"></i>,
      onClick: () => deleteService(contextMenu.serviceName),
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
        <ul className="absolute bg-background-elm2 rounded-3xl p-1 top-56 right-[50%] translate-x-[50%]">
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
              price={formatPrice(enterCodesValue.price)}
              hide={`hidden`}
              onContextMenu={(x, y) => handleContextMenu(x, y, enterCodesValue)}
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
      {showPopup && (
        <Popup
          title={popupContent.title}
          inputs={popupContent.inputs}
          onClose={() => setShowPopup(false)}
          handleSubmit={popupContent.onSubmit} // باید handleSubmit باشد
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

export default HeaderServices;