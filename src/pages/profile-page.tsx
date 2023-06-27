import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { object, string, ref } from "yup";
import { currentUser } from "../utilities/http";
import { AppNavBar } from "../components/app-navigation";
import manImg from "../assets/pngs/man.jpg";
import AppIcon from "../components/app-icon";
import { auth } from "../utilities/database/firebase";
import LoadingSpinner from "../components/loader";
import Popup from "../components/app-popup";
import { toast } from "react-toastify";
const safeSchema = object({
  email: string().required().email(),
  displayName: string().required().min(2).max(30).label("user name"),
});
const sensitiveSchema = object({
  oldPassword: string().required(),
  newPassword: string().required().min(8),
  repeatNewPassword: string()
    .oneOf([ref("newPassword")], "passwords must match")
    .required("repeat password please")
    .label("password"),
});
type SafeData = {
  email: string;
  displayName: string;
};
type SensitiveData = {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};
export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>();
  const [modalOpen, setModalOpen] = useState<boolean>();
  const [formError, setFormError] = useState<string>("");
  const [sensitiveFormError, setSensitiveFormError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [safeData, setSafeData] = useState<SafeData>({
    displayName: "",
    email: "",
  });
  const [safeDataErrors, setSafeDataErrors] = useState<SafeData>({
    displayName: "",
    email: "",
  });
  const [sensitiveData, setSensitiveData] = useState<SensitiveData>({
    oldPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [sensitiveDataErrors, setSensitiveDataErrors] = useState<SensitiveData>(
    {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    }
  );
  function handlePasswordsChange(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target;
    let value = target.value;
    let name = target.name as keyof SensitiveData;
    setFormError("");
    setSensitiveData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateSensitiveField(name, value);
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let target = e.target;
    let value = target.value;
    let name = target.name as keyof SafeData;
    setFormError("");
    setSafeData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  }
  async function validateField(name: keyof SafeData, value: string) {
    try {
      let subSchema = object({
        [name]: safeSchema.fields[name],
      });
      await subSchema.validate({ [name]: value }, { strict: true });

      setSafeDataErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } catch (e: any) {
      setSafeDataErrors((prev) => ({
        ...prev,
        [name]: e?.message,
      }));
    }
  }
  async function validateSensitiveField(
    name: keyof SensitiveData,
    value: string
  ) {
    try {
      if (name === "repeatNewPassword") {
        setSensitiveDataErrors((p) => ({
          ...p,
          repeatNewPassword: "",
        }));
        if (value !== sensitiveData.newPassword) {
          setSensitiveDataErrors((p) => ({
            ...p,
            repeatNewPassword: "passwords must match",
          }));
        }
      } else {
        let subSchema = object({
          [name]: sensitiveSchema.fields[name],
        });
        await subSchema.validate({ [name]: value }, { strict: true });
        setSensitiveDataErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    } catch (e: any) {
      setSensitiveDataErrors((prev) => ({
        ...prev,
        [name]: e?.message,
      }));
    }
  }
  async function setCurrentUser() {
    let userCopy = await currentUser();
    setUser(userCopy);
    if (!userCopy) navigate("/auth/login");
    setSafeData({
      displayName: userCopy?.displayName || "",
      email: userCopy?.email || "",
    });
  }
  function resetSafeForm() {
    if (!user) return;
    const { displayName, email } = user;
    setSafeData({
      displayName: displayName ?? "",
      email: email ?? "",
    });
  }
  async function validateForm() {
    try {
      if (formError) return false;
      await safeSchema.validate(safeData);
      return true;
    } catch (e: any) {
      setFormError((p) => e?.message);
      return false;
    }
  }
  async function submitSafeForm(pass: string) {
    setModalOpen(false);
    setLoading(true);
    try {
      if (!user || !user.email) return;
      if (!auth?.currentUser) return;
      if (!(await validateForm())) return;
      const { email: newEmail, displayName } = safeData;
      let credentials = EmailAuthProvider.credential(user?.email, pass);
      reauthenticateWithCredential(auth.currentUser, credentials)
        .then(async () => {
          await updateProfile(auth?.currentUser || user, { displayName });
          await updateEmail(auth?.currentUser || user, newEmail);
          toast("email and name updated successfuly", { type: "success" });
          setPassword("");
        })
        .catch((e: any) => {
          toast("error updating email and name ", { type: "error" });
          setFormError(e.message);
        });
      setLoading(false);
    } catch (e: any) {
      setFormError(e.message);
      setLoading(false);
    }
  }
  function requestPassword(e: React.FormEvent) {
    e.preventDefault();
    setModalOpen(true);
  }
  async function validatePasswordsForm(): Promise<boolean> {
    try {
      setFormError("");
      await sensitiveSchema.validate(sensitiveData);
      return true;
    } catch (e: any) {
      setSensitiveFormError((p) => e?.message);
      return false;
    }
  }
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!(await validatePasswordsForm())) return;
      setLoading(true);
      if (!user?.email) return;
      if (!auth.currentUser) return;
      const credentials = EmailAuthProvider.credential(
        user?.email,
        sensitiveData.oldPassword
      );
      setSensitiveFormError("");
      await reauthenticateWithCredential(auth.currentUser, credentials).then(
        async () => {
          if (!auth.currentUser) return;
          await updatePassword(auth.currentUser, sensitiveData.newPassword);
          toast("password changed successfuly", { type: "success" });
          setLoading(false);
        }
      );
    } catch (e: any) {
      setSensitiveFormError(e.message);
      toast("Error changing password", { type: "error" });
      setLoading(false);
    }
  }

  async function verifieUserEmail() {
    if (!user) return;
    await sendEmailVerification(user);
    toast("a verification email link sent to your email", {
      type: "success",
    });
  }
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target?.files?.[0];
      if (file) {
        setLoading(true);
        const storage = getStorage();
        const oldImageUrl = user?.photoURL;
        const stRef = storageRef(storage, "images/" + file.name);
        await uploadBytes(stRef, file)
          .then(async () => {
            await getDownloadURL(stRef).then(async (downloadURL) => {
              if (!auth?.currentUser) return;
              if (!user) return;
              let userCopy = { ...user };
              userCopy.photoURL = downloadURL;
              setUser(userCopy);
              await updateProfile(auth.currentUser || user, {
                photoURL: downloadURL,
              })
                .then(() => {
                  toast("image updated succefully", { type: "success" });
                  setLoading(false);
                })
                .then(async () => {
                  if (oldImageUrl) {
                    try {
                      let strgRef = storageRef(storage, oldImageUrl);
                      await deleteObject(strgRef);
                    } catch (error) {
                      toast("Error deleting old image:", { type: "error" });
                    }
                  }
                })
                .catch((e) => {
                  toast("Error uploading image:", {
                    type: "error",
                  });
                  setLoading(false);
                });
            });
          })
          .catch((error) => {
            toast("Error uploading image:", {
              type: "error",
            });
          });
      }
    } catch (e: any) {}
    setLoading(false);
  }
  useEffect(() => {
    setCurrentUser();
  }, []);
  return (
    <>
      <Popup open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="password-auth">
          <h2>Enter your password to continue</h2>
          <TextField
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            value={password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIcon
                    style={{
                      cursor: "pointer",
                    }}
                    name="Key"
                    color="success"
                  />
                </InputAdornment>
              ),
            }}
            color="success"
            placeholder="password"
            label={"password"}
          />
          <div className="actions">
            <button
              className="link button btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="link button"
              onClick={async () => await submitSafeForm(password)}
            >
              Submit
            </button>
          </div>
        </div>
      </Popup>
      <main className="profile-page fullHeight">
        {loading && <LoadingSpinner />}
        <AppNavBar />
        <section className="profile-content">
          <div className="user-credentials">
            <div className="user-image">
              <img src={user?.photoURL || manImg} />
              <div className="overlap">
                <input type="file" id="image" onChange={handleImageUpload} />
                <label htmlFor="image" className="upload-image-btn">
                  <AppIcon name="BackupTwoTone" />
                </label>
              </div>
            </div>
            <div className="user-name-email">
              <h1>
                <span>{safeData?.displayName}</span>
                <span
                  className={`security-icon  ${
                    user?.emailVerified ? "verified" : ""
                  }`}
                >
                  {user?.emailVerified ? (
                    <AppIcon name="Verified" />
                  ) : (
                    <AppIcon name="GppMaybe" />
                  )}
                </span>
              </h1>
              <span className="user-email">{safeData?.email}</span>
            </div>
          </div>
          <div className="guides">
            <h3>Hi {safeData?.displayName?.split(" ")[0]}</h3>
            <p>update your profile and details below</p>
            <hr />
          </div>
          <div className="credentials-edit">
            <div className="safe-credentials">
              <div className="intro">
                <h1>private profile</h1>
                <p>this will display on your profile</p>
              </div>
              <form className="form-group">
                {formError && (
                  <Alert severity="error">
                    {formError.replace("Firebase", "Todowi")}
                  </Alert>
                )}
                <TextField
                  onChange={handleChange}
                  name="displayName"
                  value={safeData.displayName}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIcon
                          style={{
                            cursor: "pointer",
                          }}
                          name="Person"
                          color="success"
                        />
                      </InputAdornment>
                    ),
                  }}
                  color="success"
                  placeholder="user name"
                />
                {safeDataErrors.displayName && (
                  <Alert severity="error">{safeDataErrors.displayName}</Alert>
                )}
                <TextField
                  onChange={handleChange}
                  name="email"
                  value={safeData.email}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIcon
                          style={{
                            cursor: "pointer",
                          }}
                          name="Email"
                          color="success"
                        />
                      </InputAdornment>
                    ),
                  }}
                  color="success"
                  placeholder="email"
                />
                {safeDataErrors.email && (
                  <Alert severity="error">{safeDataErrors.email}</Alert>
                )}
                <div className="actions">
                  <button
                    className="link button btn-secondary"
                    type="reset"
                    onClick={resetSafeForm}
                  >
                    Cancel
                  </button>
                  <button
                    className={`link button ${
                      formError ||
                      safeDataErrors.displayName ||
                      safeDataErrors.email
                        ? "disabled"
                        : ""
                    }`}
                    onClick={requestPassword}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
            <div className="password-edit">
              <h1>Reset Password</h1>
              <form className="form-group">
                {sensitiveFormError && (
                  <Alert severity="error">
                    {sensitiveFormError.replace("Firebase", "Todowi")}
                  </Alert>
                )}
                <TextField
                  value={sensitiveData.oldPassword}
                  onChange={handlePasswordsChange}
                  name="oldPassword"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIcon
                          style={{
                            cursor: "pointer",
                          }}
                          name="Key"
                          color="success"
                        />
                      </InputAdornment>
                    ),
                  }}
                  color="success"
                  placeholder="enter old password"
                />
                {sensitiveDataErrors.oldPassword && (
                  <Alert severity="error">
                    {sensitiveDataErrors.oldPassword}
                  </Alert>
                )}
                <TextField
                  required
                  value={sensitiveData.newPassword}
                  onChange={handlePasswordsChange}
                  name="newPassword"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIcon
                          style={{
                            cursor: "pointer",
                          }}
                          name="LockReset"
                          color="success"
                        />
                      </InputAdornment>
                    ),
                  }}
                  color="success"
                  placeholder="enter new password"
                />
                {sensitiveDataErrors.newPassword && (
                  <Alert severity="error">
                    {sensitiveDataErrors.newPassword}
                  </Alert>
                )}
                <TextField
                  required
                  value={sensitiveData.repeatNewPassword}
                  onChange={handlePasswordsChange}
                  name="repeatNewPassword"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AppIcon
                          style={{
                            cursor: "pointer",
                          }}
                          name="LockReset"
                          color="success"
                        />
                      </InputAdornment>
                    ),
                  }}
                  color="success"
                  placeholder="reenter new password"
                />
                {sensitiveDataErrors.repeatNewPassword && (
                  <Alert severity="error">
                    {sensitiveDataErrors.repeatNewPassword}
                  </Alert>
                )}
                <div className="actions">
                  <button
                    className="link button btn-secondary"
                    onClick={() => {
                      setSensitiveData({
                        oldPassword: "",
                        newPassword: "",
                        repeatNewPassword: "",
                      });
                      setSensitiveDataErrors({
                        oldPassword: "",
                        newPassword: "",
                        repeatNewPassword: "",
                      });
                    }}
                    type="reset"
                  >
                    Cancel
                  </button>
                  <button
                    className={`link button ${
                      sensitiveFormError ||
                      sensitiveDataErrors.oldPassword ||
                      sensitiveDataErrors.newPassword ||
                      sensitiveDataErrors.repeatNewPassword
                        ? "disabled"
                        : ""
                    }`}
                    type="submit"
                    onClick={handleChangePassword}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
          {!user?.emailVerified && (
            <button className="button link verifie" onClick={verifieUserEmail}>
              verifie email
            </button>
          )}
        </section>
      </main>
    </>
  );
}
