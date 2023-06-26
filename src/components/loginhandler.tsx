import AppIcon from "../components/app-icon";
import { AppLink } from "../components/app-link";
import GoogleSvg from "../components/googlesvg";
import {
  auth,
  googleProvider,
  githubProvider,
} from "../utilities/database/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { updateUser } from "../utilities/http";
import { Alert, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { string, object } from "yup";
let schema = object({
  email: string().email().required(),
  password: string().min(8).required(),
});
type Data = {
  email: string;
  password: string;
};
function LoginHandler() {
  const [formError, setFormError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<Data>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Data>({
    email: "",
    password: "",
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target;
    let value = target.value;
    let name = target.name as keyof Data;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  }
  async function validateField(name: keyof Data, value: string) {
    try {
      let subSchema = object({
        [name]: schema.fields[name],
      });
      await subSchema.validate({ [name]: value }, { strict: true });
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        [name]: e?.message,
      }));
    }
  }
  async function validateForm() {
    try {
      if (formError) return false;
      await schema.validate(data);
      return true;
    } catch (e: any) {
      setFormError((p) => e?.message);
      return false;
    }
  }
  async function signUser() {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      location.replace("/");
    } catch (e: any) {
      setFormError(e?.message);
    }
  }
  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    setFormError("");
    if (!(await validateForm())) return;
    await signUser();
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  function getDisplayName(email: string | null): string {
    if (!email) return "user";
    let dotInd = email.indexOf(".");
    let atInd = email.indexOf("@");
    let name: string = email.slice(0, atInd);
    if (dotInd < atInd) name = email.slice(0, dotInd);
    return name;
  }
  async function signWithGoogle(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.replace("/");
    } catch (e: any) {
      setFormError(e?.message);
    }
  }
  async function signWithGitHub(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { user } = await signInWithPopup(auth, githubProvider);
      await updateUser(user, {
        displayName: user?.displayName ?? getDisplayName(user?.email),
        photoURL: user?.photoURL,
      });
      window.location.replace("/");
    } catch (e: any) {
      console.log(e);
      setFormError(e?.message);
    }
  }
  return (
    <main className="auth-page">
      <div className="form-container">
        <form className="form">
          <h1>
            TODOWI AUTH <br />
            <span>login</span>
          </h1>
          <div className="form-group">
            {formError && (
              <Alert severity="error">
                {formError.replace("Firebase", "Todowi")}
              </Alert>
            )}
            <div className="form-item">
              <TextField
                id="filled-basic"
                value={data.email}
                name="email"
                type="email"
                onChange={handleChange}
                autoFocus
                required
                color="success"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIcon name="EmailOutlined" color="success" />
                    </InputAdornment>
                  ),
                }}
                label="email"
              />
              {errors.email && <Alert severity="error">{errors.email}</Alert>}
              <TextField
                value={data.password}
                onChange={handleChange}
                name="password"
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
              {errors.password && (
                <Alert severity="error">{errors.password}</Alert>
              )}
              <div className="submit-section">
                <button className="link button" onClick={handleSubmit}>
                  login
                </button>
                <AppLink
                  id="register"
                  data-speciallink
                  label="don't have an account ? register"
                />
                <div className="external-auth">
                  <button
                    role="button"
                    className="special-btn google"
                    onClick={signWithGoogle}
                  >
                    <GoogleSvg />
                    continue with google
                  </button>
                  <button
                    role="button"
                    className="special-btn"
                    onClick={signWithGitHub}
                  >
                    <AppIcon name="GitHub" />
                    continue with github
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
