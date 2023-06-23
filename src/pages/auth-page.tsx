import { Routes, Route } from "react-router-dom";
import LoginHandler from "../components/loginhandler";
import RegisterHandler from "../components/registerhandler";

export const AuthPage = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginHandler />} />
        <Route path="register" element={<RegisterHandler />} />
      </Routes>
    </>
  );
};
