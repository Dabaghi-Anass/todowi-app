import DropDown from "./drop-down";
import AppIcon from "./app-icon";
import { useState } from "react";

interface Props {
  categories: string[];
  filterItems: string[];
  onFilter: (key: string) => void;
  onDeleteCategory: (key: string) => void;
}
export default function SideNav({
  categories,
  filterItems,
  onDeleteCategory,
  onFilter,
}: Props) {
  const [navClosed, setNavClosed] = useState(true);
  const toggleSideNav = () => {
    setNavClosed((prev) => !prev);
  };
  return (
    <aside className={`side-nav ${navClosed && "nav-closed"}`}>
      <div className="side-nav-item head-section">
        <AppIcon name="Menu" onClick={toggleSideNav} />
        {!navClosed && <h1>Todos Manager</h1>}
      </div>
      <div className="side-nav-item categories-section">
        {navClosed && (
          <AppIcon
            name="Tune"
            style={{
              fontSize: "1.5rem",
            }}
            onClick={() => setNavClosed(false)}
          />
        )}
        {!navClosed && (
          <DropDown
            type="Categories"
            data={categories}
            onDelete={onDeleteCategory}
          />
        )}
      </div>
      <div className="side-nav-item filter-section">
        {navClosed && (
          <AppIcon
            name="FilterAltOutlined"
            style={{
              fontSize: "1.5rem",
            }}
            onClick={() => setNavClosed(false)}
          />
        )}
        {!navClosed && (
          <DropDown type="Filter BY" onFilter={onFilter} data={filterItems} />
        )}
      </div>
    </aside>
  );
}
