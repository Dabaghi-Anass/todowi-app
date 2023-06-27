import React, { useContext } from "react";
import Context from "./context";
import AppIcon from "./app-icon";
import { Task } from "../utilities/type_task";

interface TasksProps {
  item: Task;
  onDelete: (e: React.MouseEvent) => void;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHide: (e: React.MouseEvent) => void;
  onPin: (e: React.MouseEvent) => void;
}
export default function TaskWrapper({
  item,
  onDelete,
  onColorChange,
  onHide,
  onPin,
}: TasksProps) {
  const { saveTask } = useContext(Context);
  const updateHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newItem = { ...item };
    newItem.category = e.target.value;
    saveTask(newItem);
  };
  function handleEditTaskContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let newItem = { ...item };
    newItem.content = e.target.value;
    newItem.size = newItem.content.length;
    saveTask(newItem);
  }

  return (
    <div
      className="task-wrapper"
      style={{
        background: item.background,
      }}
    >
      <div className="task-wrapper-section head">
        <input
          id="category"
          style={{ color: "inherit", textTransform: "capitalize" }}
          value={item.category}
          onChange={updateHeader}
        />
        <span>
          <AppIcon
            name={`PushPin${item.isPinned ? "" : "Outlined"}`}
            className="icon icon-pin"
            onClick={(e) => onPin(e)}
          />
          <AppIcon
            name="DeleteOutline"
            onClick={(e) => onDelete(e)}
            className="icon icon-delete"
          />
        </span>
      </div>
      <div className="task-wrapper-section content">
        <textarea
          id="content"
          className="task-content-wrapper"
          value={item.content}
          onChange={(e) => handleEditTaskContent(e)}
        ></textarea>
      </div>
      <div className="task-wrapper-section footer">
        <div>
          <label>
            <input type="color" onChange={(e) => onColorChange(e)} />
            <AppIcon name="FormatColorFill" className="icon icon-colorfill" />
          </label>
          <AppIcon
            name={`Visibility${!item.isHidden ? "" : "Off"}`}
            className="icon icon-eye"
            onClick={(e) => onHide(e)}
          />
        </div>
      </div>
    </div>
  );
}
