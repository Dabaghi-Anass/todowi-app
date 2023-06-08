import React, { useEffect, useLayoutEffect, useState } from "react";
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
export default function TaskWrapper({ item, onDelete, onColorChange }: TasksProps) {
  const [selectedText, setSelectedText] = useState("");
  const [itemClone, setItem] = useState<Task>(item);

  const boldenText = () => {
    let allText = item.content.split(" ").map(w => w.trim());
    let words: Word[] = selectedText.split(' ').map(w => ({ word: w.trim(), index: allText.indexOf(w) }));
    setItem(prev => ({
      ...prev,
      boldWords :[...prev.boldWords , ...words]
    }))
  }
  const italicText = () => {
    let allText = item.content.split(" ").map(w => w.trim());
    let words: Word[] = selectedText.split(' ').map(w => ({ word: w.trim(), index: allText.indexOf(w) }));
    setItem(prev => ({
      ...prev,
      italicWords :[...prev.italicWords , ...words]
    }))
  }
  const underlineText = () => {
    let allText = item.content.split(" ").map(w => w.trim());
    let words: Word[] = selectedText.split(' ').map(w => ({ word: w.trim(), index: allText.indexOf(w) }));
    setItem(prev => ({
      ...prev,
      underlinedWords :[...prev.underlinedWords , ...words]
    }))
  }
  const updateHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({
      ...itemClone,
      category: e.target.value
    }))
  }
  const striketroughText = () => {
    let allText = item.content.split(" ").map(w => w.trim());
    let words: Word[] = selectedText.split(' ').map(w => ({ word: w.trim(), index: allText.indexOf(w) }));
    setItem(prev => ({
      ...prev,
      lineCrossedWords :[...prev.lineCrossedWords , ...words]
    }))
  }
  useLayoutEffect(() => {
    document.addEventListener('mouseup', function() {
      var selectedText = window.getSelection()?.toString();
    if (selectedText?.length)
      setSelectedText(prev => selectedText || "");
  });

  },[])
  return (
    <div className="task-wrapper" style={{
      background: itemClone.background,
    }}>
      <div className="task-wrapper-section head">
        <input id="category" value={itemClone.category} onChange={updateHeader} />
        <span>
          <AppIcon name={`PushPin${itemClone.isPinned ? "" : "Outlined"}`}
          className="icon icon-pin"/>
          <AppIcon name="DeleteOutline" onClick={(e) => onDelete(e)} className="icon icon-delete" />
        </span>
    </div>
    <div className="task-wrapper-section content">
    <FormattedText task={itemClone} />
    </div>
      <div className="task-wrapper-section footer">
        <div>
          <AppIcon name="FormatBold" className="icon icon-bold" onClick={boldenText}/>
          <AppIcon name="FormatItalic" className="icon icon-italic" onClick={italicText}/>
          <AppIcon name="FormatUnderlined" className="icon icon-underline" onClick={underlineText}/>
          <AppIcon name="FormatStrikethrough" className="icon icon-strike" onClick={striketroughText}/>
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