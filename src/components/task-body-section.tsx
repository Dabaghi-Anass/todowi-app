import { useEffect, useState } from "react";
import PopUp from "./app-popup";
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

  function hexToHsl(hex: string) {

    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const L = (max + min) / 2;

    const S =
      max === min
        ? 0
        : L > 0.5
        ? (max - min) / (2 - max - min)
        : (max - min) / (max + min);
    let H = 0;
    if (max !== min) {
      switch (max) {
        case r:
          H = (g - b) / (max - min);
          break;
        case g:
          H = 2 + (b - r) / (max - min);
          break;
        case b:
          H = 4 + (r - g) / (max - min);
          break;
      }
    }
    H *= 60;
    if (H < 0) {
      H += 360;
    }
    return { H, S, L };
  }
  const handleDeleteTask = (id: string) => {
    let dataCopy = [...data];
    dataCopy = dataCopy.filter(task => task.id !== id);
    setData(prev => dataCopy)
  };
  function rgbToHex(color: string) {
    color = color.replace("rgb(", "").replace(")", "");
    let [rs, gs, bs] = color.split(",");
    let r = +rs.trim();
    let g = +gs.trim();
    let b = +bs.trim();
    let red = r.toString(16).padStart(2, "0");
    let green = g.toString(16).padStart(2, "0");
    let blue = b.toString(16).padStart(2, "0");
    return "#" + red + green + blue;
  }

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

  useEffect(() => {
    checkColorContraste();
  });
  return (
    <section className={`task-body-section ${grid ? "grid" : ""}`}>
      {/* <PopUp /> */}
      {data.map((element) => (
        <Task
          onColorChange={(e) => handleColorChange(element.id, e)}
          key={element.id}
          item={element}
          onDelete={() => handleDeleteTask(element.id)}
        />
      ))}
    </section>
  );
}
