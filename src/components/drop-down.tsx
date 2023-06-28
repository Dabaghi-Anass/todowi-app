import { useState, useContext } from "react";
import AppIcon from "./app-icon";
import Context from "./context";
interface DropDownProps {
  type: string;
  data: string[];
  onFilter?: (key: string) => void;
  onDelete?: (key: string) => void;
}
const DropDown = ({ type, data, onFilter, onDelete }: DropDownProps) => {
  const [editItem, setEditItem] = useState("");
  const { handleEditCategory, handleSelectCategory } = useContext(Context);

  const [menuOpened, setMenuOpened] = useState(true);
  const openDropDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuOpened((prev) => !prev);
    const container = document.getElementById(`drop-down-${type}`);
    if (!container) return;
    if (menuOpened) container.classList.add("toggle-width");
    else container.classList.remove("toggle-width");
  };
  function saveCategory(category: string) {
    let input = document.getElementById(category) as HTMLInputElement;
    if (!input) return;
    handleEditCategory(
      category.trim().toLocaleLowerCase(),
      input.value.toLowerCase().trim()
    );
  }
  return (
    <div className="drop-down" id={`drop-down-${type}`}>
      <div className="drop-down-head">
        <label id="drop-down-button">{type}</label>
        <AppIcon
          id="drop-down-button"
          style={
            menuOpened
              ? {
                  transform: "rotate(180deg)",
                  fontSize: "1.5em",
                }
              : { fontSize: "1.5em" }
          }
          onClick={(e) => openDropDown(e)}
          name="ArrowDropDownOutlined"
        />
      </div>
      <div className="drop-down-body">
        {type === "Categories" ? (
          <>
            {data.map((category) => (
              <div key={category} style={{ cursor: "pointer" }}>
                {editItem === category ? (
                  <input
                    placeholder={category}
                    id={category}
                    defaultValue={category}
                  />
                ) : (
                  <span
                    className="category-name red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory(category);
                    }}
                  >
                    {category}
                  </span>
                )}
                <div className="buttons">
                  {editItem === category ? (
                    <>
                      <AppIcon
                        name="Save"
                        onClick={() => saveCategory(category)}
                      />
                      <AppIcon
                        name="Cancel"
                        onClick={() => setEditItem((prev) => "")}
                      />
                    </>
                  ) : (
                    <AppIcon
                      name="Edit"
                      onClick={() => setEditItem((prev) => category)}
                    />
                  )}
                  <AppIcon
                    name="Delete"
                    onClick={() => onDelete && onDelete(category)}
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {data.map((category) => (
              <div
                key={category}
                onClick={() => (onFilter ? onFilter(category) : null)}
              >
                <span className="filter-name" style={{ cursor: "pointer" }}>{category}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DropDown;
