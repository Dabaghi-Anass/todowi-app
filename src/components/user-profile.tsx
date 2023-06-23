import "../sass/_userprofile.scss";
import maleImg from "../assets/pngs/male.png";
import AppIcon from "./app-icon";
import { AppLink } from "./app-link";
import { useEffect, useState } from "react";
import { auth } from "../utilities/database/firebase";
import { signOut, User } from "firebase/auth";
const UserProfile = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  async function setCurrentUser() {
    setTimeout(() => {
      if (!auth?.currentUser) return;
      setUser((p) => auth.currentUser);
    }, 1000);
  }
  useEffect(() => {
    setCurrentUser();
  }, []);
  async function logOut() {
    await signOut(auth);
    window.location.replace("/");
  }
  if (!user) return <span></span>;
  return (
    <div className="profile-container">
      <div
        className="profileButton"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((p) => !expanded);
        }}
      >
        <img src={user?.photoURL || maleImg} />
        {/* {user?.email?.charAt(0).toUpperCase()} */}
      </div>
      {expanded && (
        <section className="profile">
          <div className="wrapper">
            <div className="profile-head">
              <div className="profile-infos">
                <div className="profile-img">
                  <span>{user?.email?.charAt(0).toUpperCase() || "A"}</span>
                  <img src={user.photoURL || maleImg} />
                </div>
                <div className="profile-credentiels">
                  <span className="user-name">
                    {user?.displayName || "no user"}
                  </span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>
              <AppLink id="profile" button />
            </div>
            <div className="profile-body">
              <button className="p-btn" onClick={logOut}>
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
