const EnterCode = ({
  title,
  currentUsers,
  userLimit,
  dateLimit,
  onContextMenu,
  renderAdditionalContent,
  price,
  hide,
}) => {
  const getUserLimitColor = (currentUsers, userLimit) => {
    if (currentUsers <= userLimit / 3) {
      return "text-green-500";
    } else if (currentUsers <= (2 * userLimit) / 3) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  const handleContextMenuClick = (event) => {
    event.preventDefault();
    const top = event.clientY - 480;
    const left = event.target.clientX;
    onContextMenu(left, top, title);
  };

  return (
    <li
      onContextMenu={handleContextMenuClick}
      className="w-[30rem] bg-background-org text-background-white rounded-xl m-2 p-4 flex justify-between items-center"
    >
      <section>{title}</section>
      <section className="flex items-center">
        <div
          className={`m-2 ${getUserLimitColor(currentUsers, userLimit)} ${hide}`}
        >
          {currentUsers}/{userLimit}
        </div>
        <div>{price}</div>
        <div className={`m-2 text-background-elm2 ${hide}`}>{dateLimit}</div>
        {renderAdditionalContent && renderAdditionalContent()}
        <div className="m-2 relative">
          <input
            type="checkbox"
            className="hidden"
            name="options"
            id={`options-${title}`}
          />
          <label
            htmlFor={`options-${title}`}
            onClick={handleContextMenuClick}
            className="cursor-pointer text-background-elm w-8 rounded-full h-8 border-2 border-background-elm flex items-center justify-center bg-red-950 transition-all duration-200 hover:bg-background-elm hover:text-red-950"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </label>
        </div>
      </section>
    </li>
  );
};

export default EnterCode;
