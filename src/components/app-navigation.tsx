import { AppLink } from "./app-link";
import { Logo } from "./app-logo";
import UserProfile from "./user-profile";
import AppIcon from "./app-icon";
import urls from "../utilities/urls.json";
import { auth } from "../utilities/database/firebase";
import { User } from "firebase/auth";
import { useLayoutEffect, useState } from "react";
import { currentUser } from "../utilities/http";
export function AppNavBar() {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useLayoutEffect(() => {
    (async () => {
      setUser(await currentUser());
    })();
    console.log(user);
  }, []);
  return (
    <nav>
      <Logo />
      <div>
        {!user && <AppLink id="login" />}
        <UserProfile />
      </div>
    </nav>
  );
}
export function AppFooter() {
  return (
    <footer>
      <div className="footer-logo">
        <p>all rights reserved to </p>
        <Logo />
      </div>
      <div>
        <a target="_blank" href={urls.facebook}>
          <AppIcon name="Facebook" />
        </a>
        <a target="_blank" href={urls.instagram}>
          <AppIcon name="Instagram" />
        </a>
        <a target="_blank" href={urls.linkedin}>
          <AppIcon name="LinkedIn" />
        </a>
      </div>
    </footer>
  );
}
