import React, { useEffect, useContext } from "react";
import { hexToHsl, rgbToHex } from "./utils";
import { default as TaskElement } from "./task-wrapper";
import Context from "./context";
import { deleteTaskFromDB } from "../utilities/http";
import { Task } from "../utilities/type_task";

interface DataProps {
  data: Task[];
  grid?: boolean;
}
export default function TaskBodySection({ data: tasks, grid }: DataProps) {
  const { saveTask, deleteTask } = useContext(Context);
  const handleHideTask = (id: string, e: React.MouseEvent) => {
    let element = tasks.find((e) => e.tid === id);
    if (!element) return;
    element.isHidden = !element.isHidden;
    saveTask(element);
  };
  const handlePinTask = (id: string, e: React.MouseEvent) => {
    let element = tasks.find((e) => e.tid === id);
    if (!element) return;
    element.isPinned = !element.isPinned;
    saveTask(element);
  };
  const handleCompleteTask = (id: string, e: React.ChangeEvent) => {
    let element = tasks.find((e) => e.tid === id);
    if (!element) return;
    element.isComplete = !element.isComplete;
    saveTask(element);
  };
  const handleDeleteTask = async (id: string) => {
    deleteTask(id);
    await deleteTaskFromDB(id);
  };
  const handleColorChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newData = [...tasks];
    let element = newData.find((e) => e.tid === id);
    if (!element) return;
    const color = e.target.value;
    element.background = color;
    saveTask(element);
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
  }, [tasks]);
  return (
    <section className={`task-body-section ${grid ? "grid" : ""}`}>
      {tasks.map((element) => (
        <TaskElement
          onHide={(e) => handleHideTask(element.tid, e)}
          onComplete={(e) => handleCompleteTask(element.tid, e)}
          onPin={(e) => handlePinTask(element.tid, e)}
          onColorChange={(e) => handleColorChange(element.tid, e)}
          onDelete={() => handleDeleteTask(element.tid)}
          key={element.tid}
          item={element}
        />
      ))}
    </section>
  );
}
