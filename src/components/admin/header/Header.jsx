import { NavLink } from "react-router-dom";
import "./Header.css";
import NormalBtn from "../../butttons/Normal/NormalBtn";

const HeaderLink = ({ title, link, icon }) => {
  return (
    <li className="m-2 relative">
      <NavLink
        to={link}
        className={({ isActive }) =>
          isActive
            ? "text-background-white bg-[#35363A] afterStyle w-40 block rounded-xl text-center p-2"
            : "text-background-white w-40 block rounded-full text-center p-2"
        }
      >
        <div className="flex justify-between items-center">
          {icon}
          {title}
        </div>
      </NavLink>
    </li>
  );
};

const AdminHeader = () => {
  const headerLinks = [
    {
      title: "کد های ورود",
      link: "/admin/enter-codes",
      icon: (
        <i className="fi fi-sr-address-card flex items-center justify-center"></i>
      ),
    },
    {
      title: "کد های تخفیف",
      link: "/admin/offer-codes",
      icon: (
        <i className="fi fi-sr-badge-percent flex items-center justify-center"></i>
      ),
    },
    {
      title: "سفارشات",
      link: "/admin/orders",
      icon: (
        <i class="fi fi-sr-order-history flex items-center justify-center"></i>
      ),
    },
    {
      title: "خدمات",
      link: "/admin/services",
      icon: (
        <i className="fi fi-sr-customer-care flex items-center justify-center"></i>
      ),
    },
  ];

  return (
    <header className="backdrop-blur-xl z-40 fixed flex p-2 items-center justify-between w-full">
      <nav className="flex items-center justify-between">
        <div class="flex items-center gap-x-1.5 mx-2.5">
          <i class="w-2 h-2 bg-red-500 rounded-full"></i>
          <i class="w-2 h-2 bg-amber-500 rounded-full"></i>
          <i class="w-2 h-2 bg-green-500 rounded-full"></i>
        </div>
        <ul className="flex w-full justify-evenly items-center p-2">
          {headerLinks.map((headerLink, index) => (
            <HeaderLink
              key={index}
              title={headerLink.title}
              link={headerLink.link}
              icon={headerLink.icon}
            />
          ))}
        </ul>
      </nav>
      <NormalBtn title={`بازگشت`} path={`/admin`} />
    </header>
  );
};

export default AdminHeader;
