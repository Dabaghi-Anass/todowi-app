import AppIcon from "../components/app-icon";
import { Routes, Route } from "react-router-dom";
import { InputAdornment, TextField } from "@mui/material";
import { AppLink } from "../components/app-link";
import GoogleSvg from "../components/googlesvg";
import { useState } from "react";
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

function LoginHandler() {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <main className="auth-page">
      <div className="form-container">
        <form className="form">
          <h1>
            TODOWI AUTH <br />
            <span>login</span>
          </h1>
          <div className="form-group">
            <div className="form-item">
              <TextField
                id="filled-basic"
                autoFocus
                required
                color="success"
                type="email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon name="EmailOutlined" color="success" />
                    </InputAdornment>
                  ),
                }}
                label="email"
              />
              <TextField
                id="filled-basic"
                required
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={toggleShowPassword}
                        name={`${
                          showPassword
                            ? "VisibilityOffOutlined"
                            : "VisibilityOutlined"
                        }`}
                        color="success"
                      />
                    </InputAdornment>
                  ),
                }}
                color="success"
                label="password"
              />
              <div className="submit-section">
                <button className="link button">login</button>
                <AppLink
                  id="register"
                  data-speciallink
                  label="don't have an account ? register"
                />
                <div className="external-auth">
                  <button role="button" className="special-btn google">
                    <GoogleSvg />
                    sign in with google
                  </button>
                  <button role="button" className="special-btn">
                    <AppIcon name="GitHub" />
                    sign in with github
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
function RegisterHandler() {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <main className="auth-page">
      <div className="form-container">
        <form className="form">
          <h1>
            TODOWI AUTH <br />
            <span>register</span>
          </h1>
          <div className="form-group">
            <div className="form-item">
              <TextField
                autoFocus
                id="filled-basic"
                required
                color="success"
                label="user name"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon
                        style={{
                          cursor: "pointer",
                          zIndex: 3,
                        }}
                        name="Portrait"
                        color="success"
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="filled-basic"
                required
                color="success"
                type="email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon name="EmailOutlined" color="success" />
                    </InputAdornment>
                  ),
                }}
                label="email"
              />
              <TextField
                id="filled-basic"
                required
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={toggleShowPassword}
                        name={`${
                          showPassword
                            ? "VisibilityOffOutlined"
                            : "VisibilityOutlined"
                        }`}
                        color="success"
                      />
                    </InputAdornment>
                  ),
                }}
                color="success"
                label="password"
              />
              <TextField
                required
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={toggleShowPassword}
                        name={`${
                          showPassword
                            ? "VisibilityOffOutlined"
                            : "VisibilityOutlined"
                        }`}
                        color="success"
                      />
                    </InputAdornment>
                  ),
                }}
                color="success"
                label="repeat password"
              />
              <div className="submit-section">
                <button className="link button">register new account</button>
                <AppLink
                  id="login"
                  data-speciallink
                  label="already have an account ? login"
                />
                <div className="external-auth">
                  <button role="button" className="special-btn google">
                    <GoogleSvg />
                    sign up with google
                  </button>
                  <button role="button" className="special-btn">
                    <AppIcon name="GitHub" />
                    sign up with github
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
