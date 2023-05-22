import { useEffect } from "react";
import AppIcon from "./app-icon";
import FormattedText from "./FormatedText";
type Word = {
  word: string;
  index: number
}
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
  boldWords: Word[];
  italicWords: Word[];
  underlinedWords: Word[];
  lineCrossedWords: Word[];
}

interface TasksProps{
  item: Task;
  onDelete : (e: React.MouseEvent) => void;
  onColorChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function TaskWrapper({ item, onDelete,onColorChange }: TasksProps) {

  return (
    <div className="task-wrapper" style={{
      background: item.background,
    }}>
      <div className="task-wrapper-section head">
        <span id="category">
          {item.category}</span>
        <span>
          <AppIcon name={`PushPin${item.isPinned ? "" : "Outlined"}`}
          className="icon icon-pin"/>
          <AppIcon name="DeleteOutline" onClick={(e) => onDelete(e)} className="icon icon-delete" />
        </span>
    </div>
    <div className="task-wrapper-section content">
    <FormattedText task={item} />
    </div>
      <div className="task-wrapper-section footer">
        <div>
          <AppIcon name="FormatBold" className="icon icon-bold"/>
          <AppIcon name="FormatItalic" className="icon icon-italic"/>
          <AppIcon name="FormatUnderlined" className="icon icon-underline"/>
          <AppIcon name="FormatStrikethrough" className="icon icon-strike"/>
        </div>
        <div>
          <label>
          <input type="color" onChange={(e) => onColorChange(e)} />
            <AppIcon name="FormatColorFill" className="icon icon-colorfill"/>
          </label>
          <AppIcon name="VisibilityOutlined" className="icon icon-eye"/>
        </div>
    </div>
    </div>
  )
}