import { Navigate } from "react-router";
import { Routes, Route } from "react-router-dom";
import { AppFooter } from "./components/app-navigation";
import { HomePage } from "./pages/home-page";
import { NotFound } from "./pages/not-found";
import { TasksManager } from "./pages/task-manager";
import { AuthPage } from "./pages/auth-page";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />}>
            <Route path="login"></Route>
            <Route path="register"></Route>
          </Route>
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
