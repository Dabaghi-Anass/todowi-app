import { useEffect } from "react";
import headerImage from "../assets/svgs/header.svg";
import listImage from "../assets/svgs/tasklist.svg";
import { AppLink } from "../components/app-link";
import { AppNavBar } from "../components/app-navigation";

export const HomePage = () => {
  return (
    <>
      <header className="fullHeight">
        <AppNavBar />
        <img src={headerImage} alt="" className="header-image" />
        <section className="hero">
          <p className="app-salutation">
            increase your productivity <br />
            with todowi
          </p>
          <p className="sub">never get lost</p>
          <div className="cta">
            <AppLink id="manager" button />
          </div>
        </section>
      </header>
      <section className="description fullHeight">
        <p>
          For better productivité you need
          <br />
          better management of your tasks
          <br />
          we offer a high Level management
          <br />
          system to manage your todos
          <br />
          such as filtering categorizing
          <br />
          and more
        </p>
        <img src={listImage} alt="image of a list" />
      </section>
    </>
  );
};
