import { useLayoutEffect, useState } from "react";
import "../sass/_userprofile.scss";
import maleImg from "../assets/pngs/male.png";

const UserProfile = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  function close() {
    setExpanded((p) => false);
  }
  useLayoutEffect(() => {
    addEventListener("click", close);
    return () => removeEventListener("click", close);
  }, []);
  return (
    <div
      className="profileButton"
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((p) => true);
      }}
    >
      <span>B</span>
      {expanded && (
        <section className="profile">
          <div className="user-profile-img">
            <span>B</span>
            <img src={maleImg} alt="user" />
          </div>
          <div className="info" title="user name">
            anass dabaghi
          </div>
          <div className="info" title="email">
            anass.debbaghi123@gmail.com
          </div>
          <div className="info" title="last logged in">
            last log in : 19:18 Mon
          </div>
          <button
            className="p-btn close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((p) => false);
            }}
          >
            &#x2716;
          </button>
          <button className="log-out">Log out</button>
        </section>
      )}
    </div>
  );
};

export default UserProfile;
