import { useRef, useState } from "react";
import AppIcon from "./app-icon";

interface DropDownProps{
  type: string;
  data: string[];
}
const DropDown = ({ type, data }: DropDownProps) => {
  const [menuOpened, setMenuOpened] = useState(true);
  const openDropDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuOpened(prev => !prev);
    const container = document.getElementById(`drop-down-${type}`);
    if(!container) return
    if (menuOpened)
      container.classList.add("toggle-width");
    else
      container.classList.remove("toggle-width");

  }
  return (
    <div className="drop-down" id={`drop-down-${type}`}>
      <div className="drop-down-head">
        <label id="drop-down-button">{type}</label>
        <AppIcon id="drop-down-button" style={menuOpened ? {
          transform: "rotate(180deg)",
          fontSize: "1.5em"
        } : {fontSize: "1.5em"}} onClick={(e) => openDropDown(e)} name="ArrowDropDownOutlined"/>
      </div>
      <div className="drop-down-body">
        {type === "Categories" ? <>
          {data.sort().map(category => <div key={category}>

            <span className="category-name">
              {category}
            </span>
            <div className="buttons">
              <AppIcon name="EditOutlined" />
              <AppIcon name="DeleteOutlined" />
            </div>
        </div>)}
        </> : <>        {data.map(category => <div key={category}>
            <span className="filter-name">
              {category}
            </span>
        </div>)}</>
}
      </div>
    </div>
  )
}

export default DropDown