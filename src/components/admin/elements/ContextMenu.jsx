// ContextMenu.jsx
import React, { useRef, useEffect } from "react";

const ContextMenuItem = ({ title, icon, onClick }) => {
  return (
    <button
      className="text-background-white transition-all duration-200 hover:bg-background-elm2 m-2 p-3 cursor-pointer flex justify-between items-center w-48 rounded-lg"
      onClick={onClick}
    >
      {title}
      {icon}
    </button>
  );
};

const ContextMenu = ({ contextMenu, setContextMenu, contextMenuValues }) => {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <ul
      className="absolute z-[50] backdrop-blur-lg rounded-3xl"
      style={{ top: contextMenu.y, left: 0 }}
      ref={contextMenuRef}
    >
      {contextMenuValues.map((contextMenuValue, index) => (
        <ContextMenuItem
          key={index}
          title={contextMenuValue.title}
          icon={contextMenuValue.icon}
          onClick={contextMenuValue.onClick}
        />
      ))}
    </ul>
  );
};

export default ContextMenu;
