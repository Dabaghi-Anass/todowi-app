import { Routes, Route, useNavigate } from "react-router-dom";
import LoginHandler from "../components/loginhandler";
import RegisterHandler from "../components/registerhandler";
import { useEffect } from "react";
import { auth } from "../utilities/database/firebase";
import { currentUser } from "../utilities/http";

export const AuthPage = () => {
  const navigate = useNavigate();
  async function isAuthenticated() {
    const user = await currentUser();
    if (user) navigate("/manager");
  }
  useEffect(() => {
    isAuthenticated();
  }, [auth.currentUser]);

  return (
    <Routes>
      <Route path="login" element={<LoginHandler />} />
      <Route path="register" element={<RegisterHandler />} />
    </Routes>
  );
};
