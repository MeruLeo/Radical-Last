import "./Notifcation.css";

const Notifcation = ({ icon, iconColor, content }) => {
  return (
    <div className="w-100 backdrop-blur-xl z-50 animation-notif text-white rounded-2xl flex items-center justify-between absolute top-10 right-[50%] p-4">
      <img
        src="/src/assets/radical-logo-white.png"
        className="w-12 ml-4 h-12"
        alt="notif logo"
      />
      <h5>{content}</h5>
      <i className={`fa-solid fa-circle-${icon} ${iconColor} text-2xl mr-4`}></i>
    </div>
  );
};

export default Notifcation;
