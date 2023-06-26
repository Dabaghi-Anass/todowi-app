import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Alert, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { object as YupObject, string, ref } from "yup";
import AppIcon from "../components/app-icon";
import { AppLink } from "../components/app-link";
import {
  auth,
  googleProvider,
  githubProvider,
} from "../utilities/database/firebase";
import GoogleSvg from "../components/googlesvg";
import { updateUser } from "../utilities/http";
import LoadingSpinner from "./loader";
type Data = {
  userName: string;
  email: string;
  password: string;
  repeatPassword: string;
};
interface RegisterCredentials {
  userName: string;
  email: string;
  password: string;
}

let schema = YupObject({
  userName: string().required().max(15).min(2).label("name"),
  email: string().email().required(),
  password: string().min(8).required(),
  repeatPassword: string()
    .oneOf([ref("password")], "passwords must match")
    .required("repeat password please")
    .label("password"),
});
const dataInstance: Data = {
  userName: "",
  email: "",
  password: "",
  repeatPassword: "",
};
export default function RegisterHandler() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<Data>({ ...dataInstance });
  const [errors, setErrors] = useState<Data>({ ...dataInstance });
  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
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
      if (name === "repeatPassword") {
        let subSchema = YupObject({
          password: schema.fields.password,
          repeatPassword: schema.fields.repeatPassword,
        });
        await subSchema.validate(
          { repeatPassword: value.trim(), password: data.password.trim() },
          { strict: true }
        );
      } else {
        let subSchema = YupObject({
          [name]: schema.fields[name],
        });
        await subSchema.validate({ [name]: value }, { strict: true });
      }
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
  async function registerNewUser(credentials: RegisterCredentials) {
    try {
      setLoading(true);
      const { email, password, userName } = credentials;
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateUser(user, { displayName: userName, photoURL: "" });
      setLoading(false);
      window.location.replace("/");
    } catch (e: any) {
      setFormError((p) => e?.message);
      setLoading(false);
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    if (!(await validateForm())) return;
    const { repeatPassword, ...credentials } = data;
    registerNewUser(credentials);
  }
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
      const displayName = getDisplayName(user?.email);
      await updateUser(user, { displayName, photoURL: user.photoURL });
      window.location.replace("/");
    } catch (e: any) {
      setFormError(e?.message);
    }
  }
  return (
    <>
      {loading && <LoadingSpinner />}
      <main className="auth-page">
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <h1>
              TODOWI AUTH <br />
              <span>register</span>
            </h1>
            {formError && (
              <Alert severity="error">
                {formError.replace("Firebase", "Todowi")}
              </Alert>
            )}
            <div className="form-group">
              <div className="form-item">
                <TextField
                  value={data.userName}
                  onChange={handleChange}
                  name="userName"
                  autoFocus
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
                {errors.userName && (
                  <Alert severity="error">{errors.userName} </Alert>
                )}
                <TextField
                  value={data.email}
                  onChange={handleChange}
                  required
                  color="success"
                  type="email"
                  name="email"
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
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
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
                <TextField
                  value={data.repeatPassword}
                  onChange={handleChange}
                  required
                  type={showPassword ? "text" : "password"}
                  name="repeatPassword"
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
                {errors.repeatPassword && (
                  <Alert severity="error">{errors.repeatPassword}</Alert>
                )}
                <div className="submit-section">
                  <button className="link button">register new account</button>
                  <AppLink
                    id="login"
                    data-speciallink
                    label="already have an account ? login"
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
    </>
  );
}
