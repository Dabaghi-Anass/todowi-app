import React, { useEffect, useContext } from "react";
import { hexToHsl, rgbToHex } from "./utils";
import Task from "./task-wrapper";
import Context from "./context";

interface TaskProps {
    id: string;
    content: string;
    background: string;
    size: number;
    category: string;
    creationDate: Date;
    isPinned: boolean;
    isHidden: boolean;
}

interface DataProps {
    data: TaskProps[];
    grid?: boolean;
}
export default function TaskBodySection({ data: tasks, grid }: DataProps) {
    const { saveTask, deleteTask } = useContext(Context);
    const handleHideTask = (id: string, e: React.MouseEvent) => {
        let element = tasks.find((e) => e.id === id);
        if (!element) return;
        element.isHidden = !element.isHidden;
        saveTask(element);
    };
    const handlePinTask = (id: string, e: React.MouseEvent) => {
        let element = tasks.find((e) => e.id === id);
        if (!element) return;
        element.isPinned = !element.isPinned;
        saveTask(element);
    };
    const handleDeleteTask = (id: string) => {
        deleteTask(id);
    };
    const handleColorChange = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let newData = [...tasks];
        let element = newData.find((e) => e.id === id);
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
