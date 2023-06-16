import React, { useLayoutEffect, useState } from "react";
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
  const [selectedText, setSelectedText] = useState("");
  const [selectionIndex, setSelectionIndex] = useState<number>(0);

  const changeTextAppearence = (type: string) => {
    let wordsStrings = selectedText.split(' ').map(e => e.trim());
    let words: Word[] = wordsStrings.map(w => ({ word: w, index: wordsStrings.indexOf(w) }));
    setItem(prev => ({
      ...prev,
      [type]: [...prev[type], ...words]
    }))
  };

  const updateHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({
      ...itemClone,
      category: e.target.value
    }))
  }
  useLayoutEffect(() => {
    document.addEventListener('mouseup', (e: MouseEvent) => {
      var selection = window.getSelection();
      var selectedText = selection?.toString();
      if (!selection || !selectedText) return;
      setSelectedText(selectedText);
      // var range = selection.getRangeAt(0);
      // var preSelectionRange = range.cloneRange();
      // preSelectionRange.selectNodeContents(e.target as Node);
      // preSelectionRange.setEnd(range.startContainer, range.startOffset);
      // var index = preSelectionRange.toString().trim().split(/\s+/).length;
      // setSelectionIndex(index);
    });
  }, []);

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
        <FormattedText task={itemClone} />
      </div>
      <div className="task-wrapper-section footer">
        <div>
          <AppIcon name="FormatBold" className="icon icon-bold" onClick={() => changeTextAppearence("boldWords")} />
          <AppIcon name="FormatItalic" className="icon icon-italic" onClick={() => changeTextAppearence("italicWords")} />
          <AppIcon name="FormatUnderlined" className="icon icon-underline" onClick={() => changeTextAppearence("underlinedWords")} />
          <AppIcon name="FormatStrikethrough" className="icon icon-strike" onClick={() => changeTextAppearence("lineCrossedWords")} />
        </div>
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