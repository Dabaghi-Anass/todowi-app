import React, { useState } from "react";
import { ContentEditableEvent } from "react-contenteditable";
import AppIcon from "./app-icon";
import FormattedText from "./FormatedText";
import { saveTask } from "./http";

interface Task {
  id: string;
  title: string;
  content: string;
  background: string;
  size: number;
  category: string;
  creationDate: Date;
  expirationDate: Date;
  isPinned: boolean;
  isHidden: boolean;
  [key: string]: any;
}
interface TasksProps {
  item: Task;
  onDelete: (e: React.MouseEvent) => void;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHide: (e: React.MouseEvent) => void;
  onPin: (e: React.MouseEvent) => void;
}
export default function TaskWrapper({ item, onDelete, onColorChange, onHide, onPin }: TasksProps) {
  const [itemClone, setItem] = useState<Task>(item);

  const updateHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({
      ...itemClone,
      category: e.target.value
    }))
  }
  function handleEditTaskContent(e: React.ChangeEvent<HTMLTextAreaElement>, id: string) {
    let value = e.target.value;
    setItem(prev => ({
      ...prev,
      content: value
    }))
  }



  return (
    <div className="task-wrapper" style={{
      background: itemClone.background,
    }}>
      <div className="task-wrapper-section head">
        <input id="category" style={{ color: "inherit" }} value={itemClone.category} onChange={updateHeader} />
        <span>
          <AppIcon name={`PushPin${itemClone.isPinned ? "" : "Outlined"}`}
            className="icon icon-pin" onClick={(e) => onPin(e)} />
          <AppIcon name="DeleteOutline" onClick={(e) => onDelete(e)} className="icon icon-delete" />
        </span>
      </div>
      <div className="task-wrapper-section content">
        <textarea id="content" className="task-content-wrapper" value={itemClone.content} onChange={(e) => handleEditTaskContent(e, itemClone.id)}></textarea>
      </div>
      <div className="task-wrapper-section footer">

        <div>
          <label>
            <input type="color" onChange={(e) => onColorChange(e)} />
            <AppIcon name="FormatColorFill" className="icon icon-colorfill" />
          </label>
          <AppIcon name="VisibilityOutlined" className="icon icon-eye" onClick={(e) => onHide(e)} />
        </div>
      </div>
    </div>
  )
};