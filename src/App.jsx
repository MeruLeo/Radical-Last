import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/register/Register";
import Start from "./components/start/Start";
import Db from "./components/database/db";
import Services from "./components/services/Services";
import CompanyInfo from "./components/company/company";
import Orders from "./components/orders/Orders";
import Admin from "./components/admin/Admin";
import EnterCodes from "./components/admin/enterCode/EnterCodes.jsx";
import OfferCodes from "./components/admin/offerCode/OfferCode";
import HeaderOrders from "./components/admin/orders/Orders";
import HeaderServices from "./components/admin/services/Services";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/register" element={<Register />} />
          <Route path="/db" element={<Db />} />
          <Route path="/services" element={<Services />} />
          <Route path="/company" element={<CompanyInfo />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/enter-codes" element={<EnterCodes />} />
          <Route path="/admin/offer-codes" element={<OfferCodes />} />
          <Route path="/admin/orders" element={<HeaderOrders />} />
          <Route path="/admin/services" element={<HeaderServices />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
