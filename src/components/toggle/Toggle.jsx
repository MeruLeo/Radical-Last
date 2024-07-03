import { useState } from "react";

const Toggle = ({ first, secend, firstTitle, secendTitle, top, onToggle }) => {
  const [selected, setSelected] = useState(`${first}`);

  const handleChange = (value) => {
    setSelected(value);
    onToggle(value);
    console.log("Selected:", value); // افزودن لاگ برای دیباگ
  };

  return (
    <div
      className="flex justify-center items-center fixed"
      style={{ top: `${top}px`, right: "50%", transform: "translateX(50%)" }}
    >
      <div className="flex items-center rounded-full bg-background-elm2 p-1 w-80">
        <input
          type="radio"
          name="toggle"
          id={first}
          className="hidden"
          checked={selected === `${first}`}
          onChange={() => handleChange(`${first}`)}
        />
        <label
          htmlFor={first}
          className={`flex-1 text-center py-2 rounded-full transition-all duration-300 ${
            selected === `${first}`
              ? "bg-background-white text-black"
              : "text-white cursor-pointer"
          }`}
        >
          {firstTitle}
        </label>
        <input
          type="radio"
          name="toggle"
          id={secend}
          className="hidden"
          checked={selected === `${secend}`}
          onChange={() => handleChange(`${secend}`)}
        />
        <label
          htmlFor={secend}
          className={`flex-1 text-center py-2 rounded-full transition-all duration-300 ${
            selected === `${secend}`
              ? "bg-background-white text-black"
              : "text-white cursor-pointer"
          }`}
        >
          {secendTitle}
        </label>
      </div>
    </div>
  );
};

export default Toggle;
