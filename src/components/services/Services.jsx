import "./Services.css";
import { useEffect, useState } from "react";
import NormalBtn from "../butttons/Normal/NormalBtn";
import FormComponent from '.././form/form';
import * as Yup from "yup";
import Notifcation from "../notifcation/Notifcation";
import axios from "axios";
import { Link } from "react-router-dom";


const Services = () => {
  const [discount, setDiscount] = useState(Number(localStorage.getItem("discount")) || 0);
  const [discountError, setDiscountError] = useState("");
  const [selected, setSelected] = useState("services");
  const [checkedServices, setCheckedServices] = useState([]);
  const [ourServices, setOurServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [entryCode, setEntryCode] = useState(localStorage.getItem("entercode") || "");
  const [notification, setNotifcation] = useState(null); 

  
  useEffect(() => {
    localStorage.setItem('offerCode', null);
    localStorage.setItem('discount', null);
    localStorage.setItem("checkedServices", null);
  }, [])
  

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/services")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOurServices(data);
        const storedCheckedServices = JSON.parse(localStorage.getItem("checkedServices")) || [];
        setCheckedServices(storedCheckedServices);

        let initialTotalPrice = 0;
        storedCheckedServices.forEach((serviceId) => {
          const service = data.find((s) => s.id === serviceId);
          if (service) {
            initialTotalPrice += service.price;
          }
        });
        setTotalPrice(initialTotalPrice);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCheck = (id, price) => {
    setCheckedServices((prevCheckedServices) => {
      const isChecked = prevCheckedServices.includes(id);
      const updatedServices = isChecked
        ? prevCheckedServices.filter((serviceId) => serviceId !== id)
        : [...prevCheckedServices, id];
  
      localStorage.setItem("checkedServices", JSON.stringify(updatedServices));
  
      // Calculate new total price based on checked services
      const newTotalPrice = updatedServices.reduce((acc, serviceId) => {
        const service = ourServices.find((s) => s.id === serviceId);
        return service ? acc + service.price : acc;
      }, 0);
  
      setTotalPrice(newTotalPrice);
      return updatedServices;
    });
  };
  

  const Service = ({ title, price, id }) => (
    <li
      className={`m-2 border-2 transition-all duration-200 flex justify-between w-80 p-2 rounded-xl items-center ${
        checkedServices.includes(id)
          ? "bg-background-elm border-background-elm"
          : "bg-background-org text-background-white border-background-org hover:border-background-elm"
      }`}
    >
      <div>
        <h4>{title}</h4>
        <span className="text-sm">
          {formatPrice(price)}
          <span className="text-[8px]">تومان</span>
        </span>
      </div>
      <div className="checkbox-wrapper-46">
        <input
          type="checkbox"
          checked={checkedServices.includes(id)}
          onChange={() => handleCheck(id, price)}
          id={`cbx-46-${id}`}
          className="inp-cbx"
        />
        <label htmlFor={`cbx-46-${id}`} className="cbx">
          <span>
            <svg viewBox="0 0 12 10" height="10px" width="12px">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </svg>
          </span>
        </label>
      </div>
    </li>
  );

  const ServicesWrapper = () => (
    <div>
      <ul className="relative h-60 overflow-auto top-40 bg-background-elm2 w-fit rounded-3xl right-[50%] translate-x-[50%] pt-0.5 pb-0.5">
        {ourServices.map((service) => (
          <Service key={service.id} id={service.id} title={service.title} price={service.price} />
        ))}
      </ul>
      <div className="absolute flex-col bg-background-elm2 text-background-white p-6 rounded-2xl top-[27rem] flex justify-between w-96 items-center right-[50%] translate-x-[50%]">
        <section className="flex justify-between items-center w-full">
          <div className="flex">
            <i className="fi fi-tr-binary-circle-check ml-2"></i>
            <h5>کد ورود</h5>
          </div>
          <h5>{entryCode}</h5>
        </section>
        <span className="w-10 h-[.2rem] rounded-full bg-background-elm mt-5 mb-5" />
        <section className="flex justify-between items-center w-full">
          <div className="flex">
            <i className="fi fi-tr-usd-circle ml-2"></i>
            <h5>قیمت نهایی</h5>
          </div>
          <h5>{formatPrice(Math.max(totalPrice - discount, 0))} تومان</h5>
        </section>
      </div>
      <div className="absolute top-[37rem] right-[50%] translate-x-[50%]">
        <FormComponent
        inputs={componentInputs1}
        btn={<NormalBtn title={`پرداخت`} />} 
        onSubmit={handleSubmitOrders} />
      </div>
    </div>
  );

  const handleSubmitOrders  = async () => {
    const userId = localStorage.getItem('userId'); 
    const checkedServices = JSON.parse(localStorage.getItem('checkedServices')) || [];
    const entercode = localStorage.getItem('entercode');
    const offerCode = localStorage.getItem('offerCode');
    
    await axios.post("http://127.0.0.1:5000/api/submit_order", {
      userId,
      checkedServices,
      entercode,
      offerCode,
    })
    .then((response) => {
      if (response.data.status === 'success') {
        setNotifcation({
          icon: "check",
          content: "سفارش با موفقیت ثبت شد.",
          iconColor: "text-green-500",
        });
        setTimeout(() => {setNotifcation(null)}, 3000);
      } else {
        setNotifcation({
          icon: "xmark",
          content: "خطایی در ثبت سفارش رخ داده است.",
          iconColor: "text-red-500",
        });
      }
    })
    .catch((error) => {
      console.error("Error submitting order:", error);
      setNotifcation({
        icon: "xmark",
        content: "خطایی در ثبت سفارش رخ داده است.",
        iconColor: "text-red-500",
      });
    })
    .finally(() => {
      setTimeout(() => setNotifcation(null), 3000);
    });
  };

  const applyDiscount = (values) => {
    fetch("http://localhost:5000/api/check_discount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ discount_code: values.discountcode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.discount_price) {
          localStorage.setItem('offerCode', values.discountcode);
          setDiscount(data.discount_price);
          localStorage.setItem('discount', data.discount_price);
          setDiscountError("");
          setNotifcation({
            icon: "check",
            content: "کد تخفیف اعمال شد.",
            iconColor: "text-green-500",
          });
        } else {
          setNotifcation({
            icon: "xmark",
            content: "کد تخفیف اشتباه است.",
            iconColor: "text-red-500",
          });
        }
        setTimeout(() => setNotifcation(null), 3000);
      })
      .catch((error) => {
        console.error("Error applying discount:", error);
        setDiscountError("Error applying discount");
      });
  };

  const Toggle = () => (
    <div className="flex justify-center items-center fixed top-10 right-[50%] translate-x-[50%]">
      <div className="flex items-center rounded-full bg-background-elm2 p-1 w-80">
        <input
          type="radio"
          name="toggle"
          id="services"
          className="hidden"
          checked={selected === "services"}
          onChange={() => setSelected("services")}
        />
        <label
          htmlFor="services"
          className={`flex-1 text-center py-2 rounded-full transition-all duration-300 ${
            selected === "services" ? "bg-background-white text-black" : "text-white cursor-pointer"
          }`}
        >
          انتخاب سرویس
        </label>
        <input
          type="radio"
          name="toggle"
          id="offer"
          className="hidden"
          checked={selected === "offer"}
          onChange={() => setSelected("offer")}
        />
        <label
          htmlFor="offer"
          className={`flex-1 text-center py-2 rounded-full transition-all duration-300 ${
            selected === "offer" ? "bg-background-white text-black" : "text-white cursor-pointer"
          }`}
        >
          کد تخفیف
        </label>
      </div>
    </div>
  );

  const componentInputs = [
    {
      title: "کد تخفیف",
      name: "discountcode",
      type: "text",
      validationSchema: Yup.string()
        .max(5, 'لطفا کد 5 رقمی وارد کنید')
        .min(5, 'لطفا کد 5 رقمی وارد کنید')
        .required("این فیلد اجباری است"),
      initialValue: "",
    },
  ];

  const componentInputs1 = [
    {
      title: "کد تخفیف",
      name: "discountcode",
      type: "text",
      validationSchema: "",
      initialValue: "",
      display: "hidden",
    },
  ];

  const DiscountCode = () => (
    <div className="relative top-[10rem]">
      <FormComponent
        inputs={componentInputs}
        btn={<NormalBtn title={"اعمال"} />}
        onSubmit={applyDiscount}
      />
      {discountError && <p className="text-red-500">{discountError}</p>}
    </div>
  );

  return (
    <>
      <Toggle />
      {selected === "services" && <ServicesWrapper />}
      {selected === "offer" && <DiscountCode />}
      {notification && (
        <Notifcation
          icon={notification.icon}
          content={notification.content}
          iconColor={notification.iconColor}
        />
      )}
    </>
  );
};

export default Services;
