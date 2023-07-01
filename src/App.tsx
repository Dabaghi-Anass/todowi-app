import { Navigate } from "react-router";
import { Routes, Route } from "react-router-dom";
import { AppFooter } from "./components/app-navigation";
import { HomePage } from "./pages/home-page";
import { NotFound } from "./pages/not-found";
import { TasksManager } from "./pages/task-manager";
import { AuthPage } from "./pages/auth-page";
import { Profile } from "./pages/profile-page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import AppLoader from "./components/apploader";
// import { requestNotificationPermission } from "./utilities/database/firebase";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // requestNotificationPermission();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <AppLoader />;
  }
  return (
    <>
      <main>
        <ToastContainer />
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/manager" element={<TasksManager />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate replace to="/not-found" />} />
        </Routes>
      </main>
      <AppFooter />
    </>
  );
}
export default App;
