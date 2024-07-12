import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../header/Header';
import formatPrice from '../formatingPrice';
import convertToJalali from '../dateJalali/dateExchange';

const Orders = () => {
  const [orders, setOrders] = useState([]);

useEffect(() => {
  // Function to fetch orders data from API
  const fetchOrders = async () => {
    const user_ID = Number(localStorage.getItem('userId')); // Get user_ID from local storage
    try {
      const response = await axios.get(`http://localhost:5000/api/orders_users?user_ID=${user_ID}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  fetchOrders();
}, []);


  const toggleDetails = (index) => {
    setOrders((prevOrders) =>
      prevOrders.map((order, idx) =>
        idx === index ? { ...order, detailsShow: !order.detailsShow } : order
      )
    );
  };

  const OrdersCreator = () => (
    <ul className="absolute right-[50%] translate-x-[50%] flex flex-col items-center justify-center">
      {orders.map((order, index) => (
        <Order key={index} order={order} index={index} />
      ))}
    </ul>
  );

  const Order = ({ order, index }) => {
    const { title, detailsShow, service_name } = order;
    return (
      <>
        <li className="bg-background-elm2 text-background-white rounded-full w-[40rem] m-4 p-4 flex justify-between items-center">
          <section className="flex flex-col items-start">
            <span className="mr-2">{title}</span>
            <span
              className={`text-background-elm cursor-pointer transition-all duration-200 p-2 mt-1 rounded-full ${
                detailsShow ? 'bg-red-950' : 'hover:bg-red-950'
              }`}
              onClick={() => toggleDetails(index)}
            >
               {service_name}
              <i
                className={`fa-solid fa-chevron-down mr-2 cursor-pointer ${
                  detailsShow ? 'rotate-180' : ''
                }`}
              ></i>
            </span>
          </section>
          <i className="fa-solid fa-circle-check text-green-700 text-3xl"></i>
        </li>
        {detailsShow && (
          <div className="order-details show">
            <OrderDetails order={order} />
          </div>
        )}
      </>
    );
  };

  const user_ID = Number(localStorage.getItem('userId'));

  const OrderDetails = ({ order }) => {
    const { ID_loginCode, ID_offerCode, ID_services, service_price, reg_date, disCount_value } = order;
    const [service, setService] = useState(null);

    useEffect(() => {
      // Fetch service details for the order
      const fetchService = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/service/${ID_services}`);
          console.log('====================================');
          console.log(disCount_value);
          console.log('====================================');
          setService(response.data);
        } catch (error) {
          console.error('Error fetching service details:', error);
        }
      };

      fetchService();
    }, [ID_services]);

    return (
      <ul className="bg-background-org p-0 m-0 flex flex-col border-1 border-background-elm justify-between items-center w-[40rem] h-[20rem] rounded-[2rem]">
        <li className={`w-full border-b-1 text-background-white border-background-elm flex items-center justify-between h-screen p-4 text-center`}>
          <span className="flex">
            <i className="fi fi-tr-binary-circle-check text-2xl text-background-elm flex justify-center items-center"></i>
            <h3 className="mr-4">کد ورود</h3>
          </span>
          <span>{ID_loginCode}</span>
        </li>
        <li className={`w-full border-b-1 text-background-white border-background-elm flex items-center justify-between h-screen p-4 text-center`}>
          <span className="flex">
            <i className="fi fi-tr-badge-percent text-2xl text-background-elm flex justify-center items-center"></i>
            <h3 className="mr-4">کد تخفیف</h3>
          </span>
          <span>{ID_offerCode}</span>
        </li>
        <li className={`w-full border-b-1 text-background-white border-background-elm flex items-center justify-between h-screen p-4 text-center`}>
          <span className="flex">
            <i className="fi fi-tr-usd-circle text-2xl text-background-elm flex justify-center items-center"></i>
            <h3 className="mr-4">قیمت اصلی</h3>
          </span>
          <span>{formatPrice(service_price)}</span>
        </li>
        <li className={`w-full border-b-1 text-background-white border-background-elm flex items-center justify-between h-screen p-4 text-center`}>
          <span className="flex">
            <i className="fi fi-tr-file-invoice-dollar text-2xl text-background-elm flex justify-center items-center"></i>
            <h3 className="mr-4">قیمت نهایی</h3>
          </span>
          <span>{formatPrice(service_price - disCount_value)}</span>
        </li>
        <li className={`w-full text-background-white flex items-center justify-between h-screen p-4 text-center`}>
          <span className="flex">
            <i className="fi fi-tr-calendar-lines text-2xl text-background-elm flex justify-center items-center"></i>
            <h3 className="mr-4">تاریخ</h3>
          </span>
          <span>{convertToJalali(reg_date)}</span>
        </li>
        {service && (
          <li className={`w-full border-b-1 text-background-white border-background-elm flex items-center justify-between h-screen p-4 text-center`}>
            <span className="flex">
              <i className="fi fi-tr-globe-alt text-2xl text-background-elm flex justify-center items-center"></i>
              <h3 className="mr-4">نام سرویس</h3>
            </span>
            <span>{service.name}</span>
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="rounded-3xl p-4 max-w-60 w-fit flex flex-col justify-center items-center absolute top-[20%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <Header
        title={`سفارشات`}
        desc={`خدمات شما درحال پردازش است و همکاران ما از طریق تلگرام با شما ارتباط خواهند گرفت`}
        content={<OrdersCreator />}
      />
    </div>
  );
};

export default Orders;
