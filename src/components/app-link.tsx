import { Link } from "react-router-dom";
import { default as links } from "../utilities/links.json";
interface props {
  id: keyof typeof links;
  label?: string;
  children?: React.ReactNode;
  button?: boolean;
  icon?: boolean;
  style?: Object;
  rest?: [any];
}
export const AppLink = ({
  id,
  button,
  children,
  icon,
  label,
  style,
  ...rest
}: props) => {
  return (
    <Link to={`${links[id].path}`}>
      <button className={`link ${button && "button"}`} style={style} {...rest}>
        {icon ? children : label ? label : `${links[id].label}`}
      </button>
    </Link>
  );
};
