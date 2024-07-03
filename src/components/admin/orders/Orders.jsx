import formatPrice from "../../formatingPrice";
import { useState } from "react";
import AdminHeader from "../header/Header";

const AdminOrder = () => {
  const [detailsShow, setDetailsShow] = useState({});

  const toggleDetails = (index) => {
    setDetailsShow((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const ordersValue = [
    {
      title: "سفارش 1",
      date: "1403/04/03",
      loginCode: "12345",
      discount: "A781dj",
      orgPrice: 1200000,
      lastPrice: 1000000,
      tracking: 12344812,
    },
    {
      title: "سفارش 2",
      date: "1403/06/12",
      loginCode: "67890",
      discount: "B123cd",
      orgPrice: 1500000,
      lastPrice: 1300000,
      tracking: 99391816,
    },
    {
      title: "سفارش 3",
      date: "1404/01/29",
      loginCode: "98765",
      discount: "O2984J",
      orgPrice: 3400000,
      lastPrice: 3000000,
      tracking: 12345678,
    },
  ];

  const Order = ({ order, index }) => {
    const { title, date } = order;
    return (
      <>
        <li className="w-[30rem] bg-background-org relative text-background-white rounded-xl m-2 p-4 flex justify-between items-center">
          <section className="flex flex-col items-start">
            <span className="mr-2">{title}</span>
          </section>
          <section>
            <span
              className={`text-background-elm cursor-pointer transition-all duration-200 p-2 mt-1 rounded-full ${
                detailsShow[index] ? "bg-red-950" : "hover:bg-red-950"
              }`}
              onClick={() => toggleDetails(index)}
            >
              جزئیات سفارش
              <i
                className={`fa-solid fa-chevron-down mr-2 cursor-pointer ${
                  detailsShow[index] ? "rotate-180" : ""
                }`}
              ></i>
            </span>
          </section>
        </li>
        {detailsShow[index] && (
          <div className="order-details show">
            <OrderDetails order={order} />
          </div>
        )}
      </>
    );
  };

  const OrdersCreater = () => {
    return (
      <ul className="absolute bg-background-elm2 rounded-3xl right-[50%] translate-x-[50%]">
        {ordersValue.map((order, index) => (
          <Order key={index} order={order} index={index} />
        ))}
      </ul>
    );
  };

  const OrderDetails = ({ order }) => {
    const { loginCode, discount, orgPrice, lastPrice, date, tracking } = order;
    const detailsValues = [
      {
        title: "کد ورود",
        detail: loginCode,
        icon: (
          <i className="fi fi-tr-binary-circle-check text-2xl text-background-elm flex justify-center items-center"></i>
        ),
      },
      {
        title: "کد تخفیف",
        detail: discount,
        icon: (
          <i className="fi fi-tr-badge-percent text-2xl text-background-elm flex justify-center items-center"></i>
        ),
      },
      {
        title: "قیمت اصلی",
        detail: formatPrice(orgPrice),
        icon: (
          <i className="fi fi-tr-usd-circle text-2xl text-background-elm flex justify-center items-center"></i>
        ),
      },
      {
        title: "قیمت نهایی",
        detail: formatPrice(lastPrice),
        icon: (
          <i className="fi fi-tr-file-invoice-dollar text-2xl text-background-elm flex justify-center items-center"></i>
        ),
      },
      {
        title: "تاریخ",
        detail: date,
        icon: (
          <i className="fi fi-tr-calendar-lines text-2xl text-background-elm flex justify-center items-center"></i>
        ),
      },
    ];

    return (
      <ul className="bg-background-org p-0 flex flex-col border-1 border-background-elm justify-between items-center m-4 h-[20rem] rounded-[2rem]">
        {detailsValues.map((detail, index) => (
          <li
            key={index}
            className={`w-full border-b-${detail.border} text-background-white border-background-elm flex items-center justify-between h-screen p-4 text-center`}
          >
            <span className="flex">
              {detail.icon}
              <h3 className="mr-4">{detail.title}</h3>
            </span>
            <span>{detail.detail}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <AdminHeader />
      <div className="relative top-[100px]">
        <OrdersCreater />
      </div>
    </>
  );
};

export default AdminOrder;
