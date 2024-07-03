import "./Notifcation.css";

const Notifcation = ({ icon, iconColor, content }) => {
  return (
    <div className="w-80 backdrop-blur-xl animation-notif text-white rounded-2xl flex items-center justify-between absolute top-10 right-[50%] p-2">
      <img
        src="/src/assets/radical-logo-white.png"
        className="w-12 h-12"
        alt="notif logo"
      />
      <h5>{content}</h5>
      <i className={`fa-solid fa-circle-${icon} ${iconColor} text-2xl`}></i>
    </div>
  );
};

export default Notifcation;
