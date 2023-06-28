import AppIcon from "./app-icon";

interface Props {
  children: React.ReactElement[] | React.ReactElement;
  onClose: () => void;
  open?: boolean;
}
function Popup({ children, onClose, open = false }: Props) {
  return (
    <div
      className="model-wrapper"
      style={{
        display: `${open ? "flex" : "none"}`,
      }}
    >
      <AppIcon name="Close" className="icon close-icon" onClick={onClose} />
      <div className="popup">{children}</div>
    </div>
  );
}

export default Popup;
