import { useLayoutEffect, useState } from "react";
import "../sass/_userprofile.scss";
import maleImg from "../assets/pngs/male.png";
import { AppLink } from "./app-link";
import AppIcon from "./app-icon";

const UserProfile = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="profile-container">
      <div
        className="profileButton"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((p) => !expanded);
        }}
      >
        B
      </div>
      {expanded && (
        <section className="profile">
          <div className="wrapper">
            <div className="profile-head">
              <div className="profile-infos">
                <div className="profile-img">
                  <span>B</span>
                  <img src={maleImg} />
                </div>
                <div className="profile-credentiels">
                  <span className="user-name">anass dabaghi</span>
                  <span className="user-email">
                    anass.debbaghi123@gmail.com
                  </span>
                </div>
              </div>
              <AppLink id="profile" button />
            </div>
            <div className="profile-body">
              <button className="p-btn">
                <AppIcon style={{ fontSize: "1.5rem" }} name="Logout" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
          <div className="profile-footer">last visit : 19:18 Mon</div>
        </section>
      )}
    </div>
  );
};

export default UserProfile;
