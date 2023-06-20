import * as Icons from "@mui/icons-material";
import { useState, useEffect, MouseEventHandler } from "react";

interface IconProps {
  name: keyof typeof Icons;
  color?: string;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  style?: Object;
  className?: string;
  rest?: [any];
  id?: string;
}

export default function AppIcon({
  name,
  color,
  id,
  onClick,
  style,
  className,
  ...rest
}: IconProps) {
  const [Icon, setIcon] = useState<React.ElementType>(Icons.Home);

  useEffect(() => {
    setIcon(Icons[name]);
  }, [name]);

  return (
    <div {...rest} id={id} className="button" onClick={onClick}>
      <Icon
        color={color}
        className={className}
        style={style}
        fontSize="inherit"
      />
    </div>
  );
}
