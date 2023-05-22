import { useEffect, useRef, useState } from "react";

interface Props{
  children: React.ReactElement[] | React.ReactElement;
}
function Popup({children} : Props) {
  const [modalOpen, setModalOpen] = useState(true);
  useEffect(() => {
      addEventListener("keypress", (e) => {
        if (e.key === "Enter") setModalOpen(!modalOpen);
      });
  }, []);
  return (
    <div className="model-wrapper" style={{
      display: `${modalOpen ? "flex" : "none"}`,
    }}>
      <div className="popup">
        { children }
      </div>
    </div>
  );
}

export default Popup;
