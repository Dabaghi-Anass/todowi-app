import React, { useEffect, useState } from "react";
import {hexToHsl,rgbToHex} from "./utils"
import Task from "./task-wrapper";
type Word = {
  word: string;
  index: number;
};
interface TaskProps {
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

interface DataProps {
  data: TaskProps[];
  grid?: boolean;
}
export default function TaskBodySection({ data: tasks, grid }: DataProps) {

  const [data, setData] = useState<TaskProps[]>(tasks);
  const handleHideTask = (id: string, e: React.MouseEvent) => {
    console.log("hidden")
  }
  const handlePinTask = (id: string, e: React.MouseEvent) => {
    console.log("pinned")
  }
  const handleDeleteTask = (id: string) => {
    let dataCopy = [...data];
    dataCopy = dataCopy.filter(task => task.id !== id);
    setData(prev => dataCopy)
  };
  const handleColorChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newData = [...data];
    let element = newData.find((e) => e.id === id);
    if (!element) return;
    let elementIndex = newData.indexOf(element);
    const color = e.target.value;
    newData[elementIndex].background = color;
    setData((prev) => newData);
  };

  function checkColorContraste() {
    let nodes = Array.from(
      document.querySelectorAll(".task-wrapper")
    ) as HTMLElement[];
    for (let node of nodes) {
      let nodeBG = node.style.getPropertyValue("background");
      changeTextClr(node, rgbToHex(nodeBG));
    }
  }
  function changeTextClr(node: HTMLElement, color: string) {
    let colorLightness = hexToHsl(color).L;
    if (colorLightness < 0.5) node.style.setProperty("--clr", "white");
    else node.style.setProperty("--clr", "#101010");
  }

  useEffect(() => {
    checkColorContraste();
  });
  return (
    <section className={`task-body-section ${grid ? "grid" : ""}`}>
      {data.map((element) => (
        <Task
          onHide={(e) => handleHideTask(element.id, e)}
          onPin={(e) => handlePinTask(element.id, e)}
          onColorChange={(e) => handleColorChange(element.id, e)}
          onDelete={() => handleDeleteTask(element.id)}
          key={element.id}
          item={element}
        />
      ))}
    </section>
  );
}
