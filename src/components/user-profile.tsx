import "../sass/_userprofile.scss";
import maleImg from "../assets/pngs/man.png";
import AppIcon from "./app-icon";
import { AppLink } from "./app-link";
import { useEffect, useState } from "react";
import { auth } from "../utilities/database/firebase";
import { signOut, User } from "firebase/auth";
import { currentUser } from "../utilities/http";
const UserProfile = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  async function setCurrentUser() {
    let currentUserRef = await currentUser();
    setUser(currentUserRef);
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
        <img src={user.photoURL || maleImg} />
      </div>
      {expanded && (
        <section className="profile">
          <div className="wrapper">
            <div className="profile-head">
              <div className="profile-infos">
                <div className="profile-img">
                  <img src={user.photoURL || maleImg} />
                </div>
                <div className="profile-credentiels">
                  <span className="user-name">{user?.displayName}</span>
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
          <div className="profile-footer">
            last visit : {user?.metadata?.lastSignInTime}
          </div>
        </section>
      )}
    </div>
  );
};

export default UserProfile;
