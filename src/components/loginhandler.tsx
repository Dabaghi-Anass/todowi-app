import AppIcon from "../components/app-icon";
import { InputAdornment, TextField } from "@mui/material";
import { AppLink } from "../components/app-link";
import GoogleSvg from "../components/googlesvg";
import { useState } from "react";

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

export default LoginHandler;
