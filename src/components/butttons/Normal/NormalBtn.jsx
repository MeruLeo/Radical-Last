import { Link, useNavigate } from "react-router-dom";
import "./NormalBtn.css";

const NormalBtn = ({ title, path }) => {
  const navigate = useNavigate();
  return (
    <>
      <button class="cssbuttons-io-button w-56" onClick={() => navigate(path)}>
        <div class="icon">
          <svg
            height="24"
            width="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M7.828 13l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414L7.828 11H20v2z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        {title}
      </button>
    </>
  );
};

export default NormalBtn;
